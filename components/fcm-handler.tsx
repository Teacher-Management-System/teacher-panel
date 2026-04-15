"use client";

import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useFcm } from "@/hooks/use-fcm";
import { useContext } from "react";
import { ModalContext } from "@/components/modal-provider";
import NotificationModal from "@/components/notification-modal";

export default function FcmHandler() {
  const { user, isActive, isLoading } = useAuth();
  const { registerNotifications, isFirebaseConfigured } = useFcm();
  const modalContext = useContext(ModalContext);

  useEffect(() => {
    console.log(
      "[FCM] Effect triggered. user:",
      !!user,
      "| isFirebaseConfigured:",
      isFirebaseConfigured,
      "| isActive:",
      isActive,
      "| modalContext:",
      !!modalContext,
    );

    if (isLoading) return; // Wait for auth to load

    if (!user || !isFirebaseConfigured) {
      console.log(
        "[FCM] Early return — user:",
        !!user,
        "| configured:",
        isFirebaseConfigured,
      );
      return;
    }

    // Trigger notification prompt modal after login
    const autoRegisterOnLogin = async () => {
      const currentPermission =
        typeof Notification !== "undefined"
          ? Notification.permission
          : "default";
      console.log("[FCM] Notification.permission:", currentPermission);

      if (currentPermission === "default") {
        console.log("[FCM] Permission is default — will open modal in 1s");
        // 1-second delay to ensure the dashboard has loaded smoothly
        setTimeout(() => {
          console.log("[FCM] Timeout fired — modalContext:", !!modalContext);
          modalContext?.openModal(
            NotificationModal,
            {
              onEnable: async () => {
                await registerNotifications();
                modalContext.closeModal();
              },
            },
            { size: "sm" },
          );
        }, 1000);
      } else if (currentPermission === "granted") {
        console.log("[FCM] Already granted — registering silently");
        await registerNotifications();
      } else {
        console.log("[FCM] Permission is denied — skipping modal");
      }
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
  }, [
    user,
    isLoading,
    isActive,
    registerNotifications,
    modalContext,
    isFirebaseConfigured,
  ]);

  return null;
}
