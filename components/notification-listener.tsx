"use client";

import { useEffect } from "react";
import { getEcho } from "@/lib/echo";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

import { useNotifications } from "@/context/notification-context";
import { stripHtml } from "@/lib/utils";

export default function NotificationListener() {
  const { user } = useAuth();
  const router = useRouter();
  const { addNotification } = useNotifications();

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const publicChannel = echo.channel("notification-channel");
    publicChannel.listen("NotificationEvent", (data: any) => {
      console.log("Public Notification:", data);
      toast.info(data.message || "New update available!");
    });
    publicChannel.listen("AnnouncementEvent", (data: any) => {
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
        const title = notification.title || "New Message";
        const message =
          notification.body || notification.message || "You have a new update.";

        const ticketId = notification.ticket_id || notification.data?.ticket_id;
        
        // STRICT FILTER: If it doesn't have a ticket_id, it's an announcement/global update
        // We check for truthy ticketId (ignoring null, undefined, 0, false, "null", etc.)
        const hasTicketId = ticketId && ticketId !== "null" && ticketId !== "undefined";

        if (!hasTicketId) {
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
          ticket_id: ticketId,
        });
        if (ticketId) {
          // Add a small delay to ensure backend DB state is fully updated before refresh
          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent("ticket-updated", {
                detail: { ...notification, ticket_id: ticketId },
              }),
            );
          }, 1000);
        }

        // Prevent showing toast if the user is currently on the same ticket's chat view
        let isCurrentlyActive = false;
        if (typeof window !== "undefined" && ticketId) {
          const w = window as any;

          const matchById =
            w.currentActiveTicketId &&
            String(w.currentActiveTicketId) === String(ticketId);
          const matchByNumber =
            w.currentActiveTicketNumber &&
            String(w.currentActiveTicketNumber).includes(String(ticketId));

          if (
            window.location.pathname.includes("/ticket") &&
            (matchById || matchByNumber)
          ) {
            isCurrentlyActive = true;
          }
        }

        if (!isCurrentlyActive) {
          const toastId = ticketId ? `toast-${ticketId}` : `toast-${title}`;
          const handleClick = () => {
            if (ticketId) {
              router.push(`/ticket?ticketId=${ticketId}`);
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
              duration: 8000,
              action: ticketId
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
  }, [user?.id]);

  return null;
}
