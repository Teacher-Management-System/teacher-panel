"use client";

import { useEffect, useRef } from "react";
import { onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useFcm } from "@/hooks/use-fcm";
import { useContext } from "react";
import { ModalContext } from "@/components/modal-provider";
import NotificationModal from "@/components/notification-modal";
import { usePathname } from "next/navigation";

export default function FcmHandler() {
  const { user, isActive, isLoading } = useAuth();
  const { registerNotifications, isFirebaseConfigured } = useFcm();
  const modalContext = useContext(ModalContext);
  const pathname = usePathname();

  const hasPrompted = useRef(false);

  useEffect(() => {
    if (isLoading || !isFirebaseConfigured) return;

    if (!user || !isActive) {
      hasPrompted.current = false;
      return;
    }

    const isPublicPage =
      pathname === "/" ||
      pathname.startsWith("/auth") ||
      pathname.startsWith("/website") ||
      pathname.startsWith("/faq") ||
      pathname.startsWith("/inquiry") ||
      pathname.startsWith("/privacy");

    if (isPublicPage) return;

    const isIOS =
      typeof window !== "undefined" &&
      (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

    if (isIOS) {
      console.log("[FCM] Suppressing prompt for iOS device");
      return;
    }

    if (hasPrompted.current) return;

    let timeoutId: NodeJS.Timeout;

    const runRegistration = async () => {
      try {
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
                isDenied: currentPermission === "denied",

                // ✅ "denied" case: show browser guide steps, no requestPermission() call
                onEnable: async () => {
                  if (currentPermission === "denied") {
                    // Nothing to call — modal already shows manual steps.
                    // Just close so user can follow the instructions.
                    modalContext.closeModal();
                    return;
                  }

                  // "default" case: trigger browser permission popup normally
                  try {
                    await registerNotifications();
                  } catch (e) {
                    console.error("[FCM] Modal registration failed:", e);
                  }
                  modalContext.closeModal();
                },

                onDismiss: () => {
                  modalContext.closeModal();
                },
              },
              { size: "sm" },
            );
          }, 1500);
        } else if (currentPermission === "granted") {
          hasPrompted.current = true;
          console.log("[FCM] Already granted — registering silently");
          await new Promise((resolve) => setTimeout(resolve, 800));
          await registerNotifications(true);
        }
      } catch (error: any) {
        if (error?.response?.status === 401) {
          console.warn(
            "[FCM] Unauthorized while updating token - user might still be logging in",
          );
        } else {
          console.error("[FCM] Registration error:", error);
        }
      }
    };

    const setupForegroundListener = async () => {
      try {
        const messaging = await getFirebaseMessaging();
        if (!messaging) return;

        const unsubscribe = onMessage(messaging, (payload) => {
          console.log("Message received in foreground:", payload);

          const title = payload.notification?.title || "New Notification";
          const body = payload.notification?.body || "";

          if (
            typeof Notification !== "undefined" &&
            Notification.permission === "granted"
          ) {
            navigator.serviceWorker.ready
              .then((registration) => {
                registration.showNotification(title, {
                  body,
                  icon: "/logo-icon.png",
                  badge: "/logo-icon.png",
                  tag: "teacher-panel-notification",
                  renotify: true,
                } as any);
              })
              .catch((e) => {
                console.warn("[FCM] ServiceWorker notification failed:", e);
                try {
                  new Notification(title, { body, icon: "/logo-icon.png" });
                } catch (err) {
                  console.error(
                    "[FCM] Native notification fallback failed:",
                    err,
                  );
                }
              });
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error setting up foreground listener:", error);
      }
    };

    runRegistration();
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
    pathname,
  ]);

  return null;
}
