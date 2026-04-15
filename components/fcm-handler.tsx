"use client";

import { useEffect, useRef } from "react";
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

  const hasPrompted = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    if (!user || !isFirebaseConfigured) {
      hasPrompted.current = false;
      return;
    }

    if (hasPrompted.current) return;

    let timeoutId: NodeJS.Timeout;

    const autoRegisterOnLogin = async () => {
      const currentPermission =
        typeof Notification !== "undefined"
          ? Notification.permission
          : "default";
      
      console.log("[FCM] Checking permission:", currentPermission);

      if (currentPermission === "default" || currentPermission === "denied") {
        hasPrompted.current = true;
        console.log(`[FCM] Prompting user (status: ${currentPermission})`);
        
        timeoutId = setTimeout(() => {
          modalContext?.openModal(
            NotificationModal,
            {
              onEnable: async () => {
                await registerNotifications();
                modalContext.closeModal();
              },
              isDenied: currentPermission === "denied",
            },
            { size: "sm" },
          );
        }, 1000);
      } else if (currentPermission === "granted") {
        hasPrompted.current = true;
        console.log("[FCM] Already granted — registering silently");
        await registerNotifications();
      }
    };

    const setupForegroundListener = async () => {
      try {
        const messaging = await getFirebaseMessaging();
        if (!messaging) return;

        const unsubscribe = onMessage(messaging, (payload) => {
          console.log("Message received in foreground: ", payload);
          
          const title = payload.notification?.title || "New Notification";
          const body = payload.notification?.body || "";

          // 1. Show nice UI toast
          toast.success(title, {
            description: body,
            duration: 10000,
          });

          // 2. Trigger native browser notification (if permission is granted)
          if (Notification.permission === "granted") {
            new Notification(title, {
              body: body,
              icon: "/logo-icon.png", // Path to your icon
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
      if (timeoutId) clearTimeout(timeoutId);
      unsubscribePromise.then((unsubscribe) => unsubscribe?.());
    };
  }, [
    user,
    isLoading,
    registerNotifications,
    modalContext,
    isFirebaseConfigured,
  ]);

  return null;
}
