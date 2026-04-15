"use client";

import { useState, useCallback, useEffect } from "react";
import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";
import profileService from "@/features/profile/aou.service";
import { toast } from "sonner";

export function useFcm() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [loading, setLoading] = useState(false);

  const registerNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const messaging = await getFirebaseMessaging();
      if (!messaging) throw new Error("Firebase Messaging not supported");

      const permissionStatus = await Notification.requestPermission();
      setPermission(permissionStatus);

      if (permissionStatus === "granted") {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (token) {
          await profileService.updateFcmToken(token);
          toast.success("Push notifications enabled!");
          return token;
        }
      } else if (permissionStatus === "denied") {
        toast.error("Notification permission denied. Please enable it in your browser settings.");
      }
    } catch (error) {
      console.error("Error specialized in useFcm:", error);
      toast.error("Failed to enable notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    permission,
    loading,
    registerNotifications,
    isSupported: typeof window !== "undefined" && "Notification" in window,
  };
}
