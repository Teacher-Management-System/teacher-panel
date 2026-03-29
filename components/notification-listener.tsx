"use client";

import { useEffect } from "react";
import { getEcho } from "@/lib/echo";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

import { useNotifications } from "@/context/notification-context";

export default function NotificationListener() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const publicChannel = echo.channel("notification-channel");
    publicChannel.listen("NotificationEvent", (data: any) => {
      console.log("Public Notification:", data);
      toast.info(data.message || "New update available!");
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

        toast.success(title, {
          description: message,
          duration: 5000,
        });
      });
    }

    return () => {
      publicChannel.stopListening("NotificationEvent");
      echo.leaveChannel("notification-channel");
      if (privateChannel && user?.id) {
        echo.leaveChannel(`notifications.${user.id}`);
      }
    };
  }, [user?.id]);

  return null;
}
