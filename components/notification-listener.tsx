"use client";

import { useEffect } from "react";
import { getEcho } from "@/lib/echo";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

import { useNotifications } from "@/context/notification-context";
import { stripHtml } from "@/lib/utils";
import { showTicketNotice } from "@/features/ticket/components/ticket-notification-toast";
import notificationService from "@/features/notifications/api.service";

export default function NotificationListener() {
  const { user, isActive } = useAuth();
  const router = useRouter();
  const { addNotification } = useNotifications();

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const publicChannel = echo.channel("notification-channel");
    publicChannel.listen("NotificationEvent", (data: any) => {
      // Allow even if not active, as long as authenticated (echo check handles auth for private, this is public)
      console.log("Public Notification:", data);
      toast.info(data.message || "New update available!");
    });
    publicChannel.listen("AnnouncementEvent", (data: any) => {
      console.log("WebSocket Announcement Received:", data);

      // Normalize data to ensure title, description, and attachments are top-level
      const normalizedData = {
        ...data,
        title: data.title || data.data?.title,
        description: data.description || data.content || data.body || data.data?.description || data.data?.content || data.data?.body,
        attachments: data.attachments || data.attachment || data.image || data.data?.attachments || data.data?.attachment || data.data?.image,
      };

      // Dispatch global event with normalized data
      window.dispatchEvent(
        new CustomEvent("new-announcement", {
          detail: normalizedData,
        }),
      );
    });
    let privateChannel: any = null;
    if (user?.id) {
      const channelName = `notifications.${user.id}`;
      privateChannel = echo.private(channelName);

      privateChannel.listen("AnnouncementEvent", (data: any) => {
        console.log("Private WebSocket Announcement Received:", data);

        const normalizedData = {
          ...data,
          id: data.id || `ann-ws-${Math.random().toString(36).substr(2, 9)}`,
          title: data.title || data.data?.title,
          description: data.description || data.content || data.body || data.message || data.data?.description || data.data?.content || data.data?.body || data.data?.message,
          attachments: data.attachments || data.attachment || data.image || data.data?.attachments || data.data?.attachment || data.data?.image,
          is_read: false,
          created_at: data.created_at || data.data?.created_at || new Date().toISOString(),
          send_at: data.send_at || data.data?.send_at || data.created_at || new Date().toISOString(),
        };

        window.dispatchEvent(
          new CustomEvent("new-announcement", {
            detail: normalizedData,
          }),
        );
      });

      privateChannel.notification((notification: any) => {
        console.log("Raw Private Notification:", notification);
        let payload = notification.data || notification;
        console.log("Initial Payload:", payload);
        if (typeof payload === 'string') {
          try {
            payload = JSON.parse(payload);
            console.log("Parsed Payload:", payload);
          } catch (e) {
            console.error("Failed to parse notification data", e);
          }
        }
        // Handle double-nested data property often seen in Laravel broadcasts
        const nestedData = (typeof payload === 'object' && payload !== null) ? (payload.data || {}) : {};

        const rawTitle = payload.title || nestedData.title || notification.title || "New Message";
        const rawMessage =
          payload.description ||
          nestedData.description ||
          payload.message ||
          nestedData.message ||
          payload.body ||
          nestedData.body ||
          payload.content ||
          nestedData.content ||
          notification.body ||
          notification.message ||
          notification.description ||
          "You have a new update.";

        // Normalize attachment: empty string from FCM must be treated as no attachment
        const normalizeAttachment = (val: any) =>
          val && val !== "" && val !== "null" && val !== "undefined" ? val : undefined;

        const rawAttachments =
          normalizeAttachment(payload.attachments) ??
          normalizeAttachment(nestedData.attachments) ??
          normalizeAttachment(payload.attachment) ??
          normalizeAttachment(nestedData.attachment) ??
          normalizeAttachment(payload.image) ??
          normalizeAttachment(nestedData.image) ??
          normalizeAttachment(payload.images) ??
          normalizeAttachment(nestedData.images);

        const ticketId =
          payload.ticket_id ||
          payload.data?.ticket_id ||
          notification.ticket_id ||
          notification.data?.ticket_id;

        let ticketNumber =
          payload.ticket_number ||
          payload.data?.ticket_number ||
          payload.ticket?.ticket_number;

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
          (rawTitle.toLowerCase().includes("open") ||
            rawMessage.toLowerCase().includes("open") ||
            rawTitle.toLowerCase().includes("assign") ||
            rawMessage.toLowerCase().includes("assign") ||
            rawTitle.toLowerCase().includes("assing") ||
            rawMessage.toLowerCase().includes("assing")) &&
          !rawTitle.toLowerCase().includes("reopen") &&
          !rawMessage.toLowerCase().includes("reopen");

        const isStatusChangeToPending =
          rawTitle.toLowerCase().includes("reopen") ||
          rawMessage.toLowerCase().includes("reopen") ||
          rawTitle.toLowerCase().includes("pending") ||
          rawMessage.toLowerCase().includes("pending");

        const isStatusChangeToClosed =
          rawTitle.toLowerCase().includes("closed") ||
          rawMessage.toLowerCase().includes("closed") ||
          rawTitle.toLowerCase().includes("resolved") ||
          rawMessage.toLowerCase().includes("resolved");

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

        // STRICT FILTER: If it's an announcement, treat as global announcement update
        if (isAnnouncement) {
          console.log(
            "Private Channel: No valid ticket_id, redirecting to Global Announcement Dialog.",
          );

          // Base detail built from FCM payload (used as fallback while API fetch is in progress)
          const baseDetail = {
            ...notification,
            ...payload,
            ...(typeof nestedData === 'object' ? nestedData : {}),
            id: notification.id || payload.id || Math.random().toString(36).substr(2, 9),
            title: rawTitle,
            description: rawMessage,
            attachments: rawAttachments,
            is_read: false,
            created_at: notification.created_at || payload.created_at || nestedData.created_at || new Date().toISOString(),
            send_at:
              notification.send_at ||
              payload.send_at ||
              nestedData.send_at ||
              notification.sendAt ||
              payload.sendAt ||
              nestedData.sendAt ||
              notification.scheduled_at ||
              payload.scheduled_at ||
              nestedData.scheduled_at ||
              notification.created_at ||
              payload.created_at ||
              nestedData.created_at ||
              new Date().toISOString(),
          };

          // Try to fetch full announcement data from API using announcement_id
          // FCM payload has a 4KB size limit so description/attachment may be truncated.
          // We prefer the full DB record if we have an ID to look up.
          const announcementId =
            payload.announcement_id ||
            nestedData.announcement_id ||
            payload.id ||
            nestedData.id ||
            notification.id;

          if (announcementId) {
            notificationService
              .getById(announcementId)
              .then((response: any) => {
                // API response is wrapped: { data: { ... }, success: true }
                const fullAnnouncement = response?.data ?? response;

                if (!fullAnnouncement?.id) {
                  console.warn("FCM: Could not fetch full announcement, using FCM payload as-is.");
                  window.dispatchEvent(new CustomEvent("new-announcement", { detail: baseDetail }));
                  return;
                }

                const detail = {
                  ...baseDetail,
                  title: fullAnnouncement.title || baseDetail.title,
                  description: fullAnnouncement.description || baseDetail.description,
                  attachments:
                    normalizeAttachment(fullAnnouncement.attachment) ??
                    normalizeAttachment(fullAnnouncement.attachments) ??
                    baseDetail.attachments,
                  announcement_type: fullAnnouncement.type || baseDetail.announcement_type,
                  send_at: fullAnnouncement.send_at || baseDetail.send_at,
                  created_at: fullAnnouncement.created_at || baseDetail.created_at,
                };

                console.log("FCM Announcement enriched from API:", detail);
                window.dispatchEvent(new CustomEvent("new-announcement", { detail }));
              })
              .catch(() => {
                // API fetch failed — fall back to FCM payload
                console.warn("FCM: API fetch failed, using FCM payload as fallback.");
                window.dispatchEvent(new CustomEvent("new-announcement", { detail: baseDetail }));
              });
          } else {
            // No ID to look up — dispatch FCM payload as-is
            console.log("Dispatched Announcement Detail (no ID for API fetch):", baseDetail);
            window.dispatchEvent(new CustomEvent("new-announcement", { detail: baseDetail }));
          }

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

        // Always add to persistent context
        addNotification({
          title,
          message,
          type: isAnnouncement ? "announcement" : "private",
          ticket_id: finalTicketId,
          data: isAnnouncement ? {
            ...notification,
            id: notification.id || Math.random().toString(36).substr(2, 9),
            title,
            description: message,
          } : undefined
        });

        if (isAnnouncement) return;

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
                  is_pending: isStatusChangeToPending,
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
