"use client";

import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useFcm } from "@/hooks/use-fcm";

export default function FcmHandler() {
  const { user, isActive } = useAuth();
  const { registerNotifications } = useFcm();

  useEffect(() => {
    if (!isActive || !user) return;

    // Trigger permission prompt and token sync immediately upon login
    const autoRegisterOnLogin = async () => {
      await registerNotifications();
    };

    const setupForegroundListener = async () => {
      try {
        const messaging = await getFirebaseMessaging();
        if (!messaging) return;

        const unsubscribe = onMessage(messaging, (payload) => {
          console.log("Message received in foreground: ", payload);
          if (payload.notification) {
            toast.success(payload.notification.title || "New Notification", {
              description: payload.notification.body,
              duration: 10000,
            });
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error setting up foreground listener:", error);
      }
    };

    autoRegisterOnLogin();
    const unsubscribePromise = setupForegroundListener();

    return () => {
      unsubscribePromise.then((unsubscribe) => unsubscribe?.());
    };
  }, [user, isActive, registerNotifications]);

  return null;
}
