"use client";

import { useEffect } from "react";
import { getEcho } from "@/lib/echo";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

import { useNotifications } from "@/context/notification-context";
import { stripHtml } from "@/lib/utils";
import { showTicketNotice } from "@/features/ticket/components/ticket-notification-toast";

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
      window.dispatchEvent(
        new CustomEvent("new-announcement", {
          detail: data,
        }),
      );
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

        const ticketId =
          data.ticket_id ||
          data.data?.ticket_id ||
          notification.ticket_id ||
          notification.data?.ticket_id;

        let ticketNumber =
          data.ticket_number ||
          data.data?.ticket_number ||
          data.ticket?.ticket_number;

        // Fallback to extract ticket number if it is not explicitly provided by backend
        if (!ticketNumber) {
          const match =
            rawMessage.match(/(?:#|T-)(\d+)/i) ||
            rawTitle.match(/(?:#|T-)(\d+)/i);
          if (match) {
            ticketNumber = match[1];
          }
        }

        // Try to map ticket_id to valid ticket reference if not provided but number is extracted
        let finalTicketId = ticketId || ticketNumber;
        const hasTicketId =
          finalTicketId &&
          finalTicketId !== "null" &&
          finalTicketId !== "undefined";

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

        const isStatusChangeToOpen =
          rawTitle.toLowerCase().includes("assign") ||
          rawMessage.toLowerCase().includes("assign") ||
          rawTitle.toLowerCase().includes("assing") ||
          rawMessage.toLowerCase().includes("assing") ||
          rawTitle.toLowerCase().includes("open") ||
          rawMessage.toLowerCase().includes("open");

        // Customize ticket assignment/opening notification ONLY if it's actually a ticket notification
        if (!isAnnouncement && (hasTicketId || isTicketNotification)) {
          if (isStatusChangeToOpen) {
            const cleanNumber = ticketNumber
              ? String(ticketNumber).replace(/#/g, "")
              : "";
            const numStr = cleanNumber ? `#${cleanNumber}` : "";
            message = `Your ticket ${numStr} is open and ready for chat.`;
          }
        }

        const isStatusChangeToClosed =
          rawTitle.toLowerCase().includes("closed") ||
          rawMessage.toLowerCase().includes("closed") ||
          rawTitle.toLowerCase().includes("resolved") ||
          rawMessage.toLowerCase().includes("resolved");

        // STRICT FILTER: If it's an announcement, treat as global announcement update
        if (isAnnouncement) {
          console.log(
            "Private Channel: No valid ticket_id, redirecting to Global Announcement Dialog.",
          );
          window.dispatchEvent(
            new CustomEvent("new-announcement", {
              detail: {
                ...notification,
                id: notification.id || Math.random().toString(36).substr(2, 9),
                title,
                description: message,
                is_read: false,
                created_at: notification.created_at || new Date().toISOString(),
              },
            }),
          );
          return;
        }

        // Trigger the premium card notification for ticket-related events
        const isCurrentTicket =
          typeof window !== "undefined" &&
          ((finalTicketId &&
            String(finalTicketId) ===
              String((window as any).currentActiveTicketId)) ||
            (ticketNumber &&
              String(ticketNumber).replace(/\D/g, "") ===
                String((window as any).currentActiveTicketNumber || "").replace(
                  /\D/g,
                  "",
                )) ||
            (window.location.pathname === "/ticket" &&
              new URLSearchParams(window.location.search).get("ticketId") ===
                String(finalTicketId)));

        if (hasTicketId && !isAnnouncement && !isCurrentTicket) {
          showTicketNotice({
            id: `ticket-notif-${finalTicketId}`, // Deduplication ID
            ticketNumber: ticketNumber || String(finalTicketId),
            subject: title,
            message: message,
            type:
              isStatusChangeToOpen || isStatusChangeToClosed
                ? "status_update"
                : "message",
            onClick: () => {
              router.push(`/ticket?ticketId=${finalTicketId}`);
            },
          });
        }

        // Always add to persistent context if it's not a global announcement
        if (!isAnnouncement) {
          addNotification({
            title,
            message,
            type: "private",
            ticket_id: finalTicketId,
          });
        }

        if (finalTicketId) {
          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent("ticket-updated", {
                detail: {
                  ...notification,
                  ticket_id: finalTicketId,
                  ticket_number: ticketNumber, // Added for robust matching
                  is_open: isStatusChangeToOpen,
                  is_closed: isStatusChangeToClosed,
                  type: "status_update",
                },
              }),
            );
          }, 1000);
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
