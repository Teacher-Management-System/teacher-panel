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

    // 1. General Public Notifications (Optional)
    const publicChannel = echo.channel("notification-channel");
    publicChannel.listen("NotificationEvent", (data: any) => {
      console.log("Public Notification:", data);
      toast.info(data.message || "New update available!");
    });

    // 2. Private User Notifications
    let privateChannel: any = null;
    if (user?.id) {
      const channelName = `notifications.${user.id}`;
      console.log(`🔔 Waiting for notifications on: ${channelName}`);

      privateChannel = echo.private(channelName);

      // Use the Laravel-specific .notification() helper
      privateChannel.notification((notification: any) => {
        console.log("🔔 REALTIME Notification Received:", notification);

        const title = notification.title || "New Message";
        const message =
          notification.body || notification.message || "You have a new update.";

        // Add to global state
        addNotification({
          title,
          message,
          type: "private",
          ticket_id: notification.ticket_id,
        });

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
