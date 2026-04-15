"use client";

import { useState, useCallback, useEffect } from "react";
import { getToken } from "firebase/messaging";
import { getFirebaseMessaging, isFirebaseConfigured } from "@/lib/firebase";
import profileService from "@/features/profile/aou.service";
import { toast } from "sonner";

export function useFcm() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default",
  );
  const [loading, setLoading] = useState(false);

  const registerNotifications = useCallback(async () => {
    console.log("FCM: registerNotifications called. Configured:", isFirebaseConfigured);
    
    if (!isFirebaseConfigured) {
      console.warn("FCM: Skip registration - Not configured in .env");
      return;
    }

    setLoading(true);
    try {
      const messaging = await getFirebaseMessaging();
      if (!messaging) {
        console.error("FCM: Messaging instance not available");
        return;
      }

      console.log("FCM: Current permission status:", Notification.permission);
      
      const permissionStatus = await Notification.requestPermission();
      console.log("FCM: Permission result after prompt:", permissionStatus);
      setPermission(permissionStatus);

      if (permissionStatus === "granted") {
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
        );
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (token) {
          await profileService.updateFcmToken(token);
          toast.success("Push notifications enabled!");
          return token;
        }
      } else if (permissionStatus === "denied") {
        toast.error(
          "Notification permission denied. Please enable it in your browser settings.",
        );
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
    isFirebaseConfigured,
    isSupported: typeof window !== "undefined" && "Notification" in window,
  };
}
