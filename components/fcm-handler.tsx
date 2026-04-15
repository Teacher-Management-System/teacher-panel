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
  const { user, isActive } = useAuth();
  const { registerNotifications, isFirebaseConfigured } = useFcm();
  const modalContext = useContext(ModalContext);

  useEffect(() => {
    if (!user || !isFirebaseConfigured) return;

    // Trigger notification prompt modal after login
    const autoRegisterOnLogin = async () => {
      const currentPermission = typeof Notification !== "undefined" ? Notification.permission : "default";

      if (currentPermission === "default") {
        // 1-second delay to ensure the dashboard has loaded smoothly
        setTimeout(() => {
          modalContext?.openModal(NotificationModal, {
            onConfirm: async () => {
              await registerNotifications();
              modalContext.closeModal();
            }
          }, { size: "sm" });
        }, 1000);
      } else if (currentPermission === "granted") {
        await registerNotifications();
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
  }, [user, isActive, registerNotifications, modalContext, isFirebaseConfigured]);

  return null;
}
