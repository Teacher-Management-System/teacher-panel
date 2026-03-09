"use client";

import { useEffect } from "react";
import { getEcho } from "@/lib/echo";
import { toast } from "sonner";

export default function NotificationListener() {
  useEffect(() => {
    const echo = getEcho();

    if (!echo) return;

    console.log('Listening for notifications on "notification-channel"...');

    const channel = echo
      .channel("notification-channel")
      .listen("NotificationEvent", (data: any) => {
        console.log("New Notification Received:", data);

        // Show a toast message if sonner is available
        toast.info(data.message || "New notification received!");
      });

    return () => {
      channel.stopListening("NotificationEvent");
      echo.leaveChannel("notification-channel");
    };
  }, []);

  return null; // This component doesn't render anything
}
