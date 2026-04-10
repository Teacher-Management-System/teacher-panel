"use client";

import { useEffect } from "react";
import { getEcho } from "@/lib/echo";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

import { useNotifications } from "@/context/notification-context";
import { stripHtml } from "@/lib/utils";

export default function NotificationListener() {
  const { user, isActive } = useAuth();
  const router = useRouter();
  const { addNotification } = useNotifications();

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const publicChannel = echo.channel("notification-channel");
    publicChannel.listen("NotificationEvent", (data: any) => {
      if (!isActive) return;
      console.log("Public Notification:", data);
      toast.info(data.message || "New update available!");
    });
    publicChannel.listen("AnnouncementEvent", (data: any) => {
      if (!isActive) return;
      console.log("WebSocket Announcement Received:", data);
      
      // Dispatch global event with full data for the list page to handle
      window.dispatchEvent(new CustomEvent("new-announcement", { 
        detail: data 
      }));
    });
    let privateChannel: any = null;
    if (user?.id) {
      const channelName = `notifications.${user.id}`;
      privateChannel = echo.private(channelName);
      privateChannel.notification((notification: any) => {
        const data = notification.data || notification;
        const rawTitle = data.title || notification.title || "New Message";
        const rawMessage =
          data.body || 
          data.message || 
          notification.body || 
          notification.message || 
          "You have a new update.";

        const ticketId = data.ticket_id || 
                       data.data?.ticket_id || 
                       notification.ticket_id || 
                       notification.data?.ticket_id;

        let ticketNumber = data.ticket_number || data.data?.ticket_number || data.ticket?.ticket_number;
        
        // Fallback to extract ticket number if it is not explicitly provided by backend
        if (!ticketNumber) {
          const match = rawMessage.match(/(?:#|T-)(\d+)/i) || rawTitle.match(/(?:#|T-)(\d+)/i);
          if (match) {
            ticketNumber = match[1];
          }
        }
        
        // Try to map ticket_id to valid ticket reference if not provided but number is extracted
        let finalTicketId = ticketId || ticketNumber;
        const hasTicketId = finalTicketId && finalTicketId !== "null" && finalTicketId !== "undefined";

        // Check if this looks like a generic system announcement vs a personal message/ticket update
        const isTicketNotification = 
          rawTitle.toLowerCase().includes("ticket") || 
          rawTitle.toLowerCase().includes("message") ||
          rawTitle.toLowerCase().includes("reply");

        const isAnnouncement = 
          notification.type?.toLowerCase().includes("announcement") ||
          rawTitle.toLowerCase().includes("announcement") ||
          (!hasTicketId && !isTicketNotification);

        let title = rawTitle;
        let message = rawMessage;

        // Customize ticket assignment/opening notification ONLY if it's actually a ticket notification
        if (!isAnnouncement && (hasTicketId || isTicketNotification)) {
          const isStatusChangeToOpen = 
            rawTitle.toLowerCase().includes("assign") || 
            rawMessage.toLowerCase().includes("assign") ||
            rawTitle.toLowerCase().includes("assing") || 
            rawMessage.toLowerCase().includes("assing") ||
            rawTitle.toLowerCase().includes("open") || 
            rawMessage.toLowerCase().includes("open");

          if (isStatusChangeToOpen) {
            const cleanNumber = ticketNumber ? String(ticketNumber).replace(/#/g, '') : "";
            const numStr = cleanNumber ? `#${cleanNumber}` : "";
            message = `Your ticket ${numStr} is open and ready for chat.`;
          }
        }

        // STRICT FILTER: If it's an announcement, treat as global announcement update
        if (isAnnouncement) {
          console.log("Private Channel: No valid ticket_id, redirecting to Global Announcement Dialog.");
          window.dispatchEvent(new CustomEvent("new-announcement", { 
            detail: { 
              ...notification, 
              id: notification.id || Math.random().toString(36).substr(2, 9),
              title, 
              description: message, 
              is_read: false,
              created_at: notification.created_at || new Date().toISOString()
            } 
          }));
          return;
        }

        addNotification({
          title,
          message,
          type: "private",
          ticket_id: finalTicketId,
        });
        if (finalTicketId) {
          // Add a larger delay to ensure backend DB state is fully updated before refresh, 
          // and to let the user see the notification and ticket before it quickly moves to 'open' tab
          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent("ticket-updated", {
                detail: { ...notification, ticket_id: ticketId },
              }),
            );
          }, 5000);
        }

        // Prevent showing toast if the user is currently on the same ticket's chat view
        let isCurrentlyActive = false;
        if (typeof window !== "undefined" && finalTicketId) {
          const w = window as any;

          const matchById =
            w.currentActiveTicketId &&
            String(w.currentActiveTicketId) === String(finalTicketId);
          const matchByNumber =
            w.currentActiveTicketNumber &&
            String(w.currentActiveTicketNumber).includes(String(finalTicketId));

          if (
            window.location.pathname.includes("/ticket") &&
            (matchById || matchByNumber)
          ) {
            isCurrentlyActive = true;
          }
        }

        if (!isCurrentlyActive) {
          const toastId = finalTicketId ? `toast-${finalTicketId}` : `toast-${title}`;
          const handleClick = () => {
            if (finalTicketId) {
              router.push(`/ticket?ticketId=${finalTicketId}`);
              toast.dismiss(toastId);
            }
          };

          toast.success(
            <div onClick={handleClick} className="w-full cursor-pointer font-medium">
              {title}
            </div>,
            {
              id: toastId, // Strict deduplication ID
              description: (
                <div onClick={handleClick} className="w-full h-full cursor-pointer mt-1">
                  {message}
                </div>
              ),
              duration: 10000,
              action: finalTicketId
                ? {
                    label: "Reply",
                    onClick: handleClick,
                  }
                : undefined,
            }
          );
        }
      });
    }

    return () => {
      publicChannel.stopListening("NotificationEvent");
      publicChannel.stopListening("AnnouncementEvent");
      echo.leaveChannel("notification-channel");
      if (privateChannel && user?.id) {
        echo.leaveChannel(`notifications.${user.id}`);
      }
    };
  }, [user?.id, isActive]);

  return null;
}
