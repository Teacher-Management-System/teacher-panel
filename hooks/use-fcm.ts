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
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const registerNotifications = useCallback(async (isSilent = false) => {
    console.log("FCM: registerNotifications called. Configured:", isFirebaseConfigured);
    
    if (!isFirebaseConfigured) {
      console.warn("FCM: Skip registration - Not configured in .env");
      return;
    }

    if (!isSilent) setLoading(true);
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
        const firebaseConfigParams = new URLSearchParams({
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
          measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
        }).toString();

        const registration = await navigator.serviceWorker.register(
          `/firebase-messaging-sw.js?${firebaseConfigParams}`,
        );

        // Wait for service worker to be active to avoid "no active Service Worker" error
        if (!registration.active) {
          console.log("FCM: Waiting for Service Worker to activate...");
          await new Promise<void>((resolve) => {
            const interval = setInterval(() => {
              if (registration.active) {
                clearInterval(interval);
                resolve();
              }
            }, 100);
          });
        }

        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (currentToken) {
          setToken(currentToken);
          await profileService.updateFcmToken(currentToken);
          if (!isSilent) toast.success("Push notifications enabled!");
          return currentToken;
        }
      } else if (permissionStatus === "denied") {
        if (!isSilent) {
          toast.error(
            "Notification permission denied. Please enable it in your browser settings.",
          );
        }
      }
    } catch (error) {
      console.error("Error specialized in useFcm:", error);
      if (!isSilent) toast.error("Failed to enable notifications.");
    } finally {
      setLoading(false);
    }
  }, []);


  return {
    permission,
    token,
    loading,
    registerNotifications,
    isFirebaseConfigured,
    isSupported: typeof window !== "undefined" && "Notification" in window,
  };
}
