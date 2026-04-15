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

    // Skip registration/prompt if user is not logged in
    if (!user) {
      hasPrompted.current = false;
      return;
    }

    // Skip prompt if we are on a public page (site pages, auth pages, etc.)
    const isPublicPage =
      pathname === "/" ||
      pathname.startsWith("/auth") ||
      pathname.startsWith("/website") ||
      pathname.startsWith("/faq") ||
      pathname.startsWith("/inquiry") ||
      pathname.startsWith("/privacy");

    if (isPublicPage) return;

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
                onEnable: async () => {
                  try {
                    await registerNotifications();
                  } catch (e) {
                    console.error("[FCM] Modal registration failed:", e);
                  }
                  modalContext.closeModal();
                },
                isDenied: currentPermission === "denied",
              },
              { size: "sm" },
            );
          }, 1500); // 1.5s delay for modal after login
        } else if (currentPermission === "granted") {
          hasPrompted.current = true;
          console.log("[FCM] Already granted — registering silently");
          // Slight delay to ensure auth headers are settled after a login redirect
          await new Promise((resolve) => setTimeout(resolve, 800));
          await registerNotifications(true); // Pass true for isSilent
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
          console.log("Message received in foreground: ", payload);

          const title = payload.notification?.title || "New Notification";
          const body = payload.notification?.body || "";

          // 2. Trigger native browser notification (Mobile compatible)
          if (
            typeof Notification !== "undefined" &&
            Notification.permission === "granted"
          ) {
            navigator.serviceWorker.ready
              .then((registration) => {
                registration.showNotification(title, {
                  body: body,
                  icon: "/logo-icon.png",
                  badge: "/logo-icon.png",
                  tag: `fcm-${Date.now()}`, // Unique tag prevents spam detection
                  renotify: false,
                } as any);
              })
              .catch((e) => {
                console.warn("[FCM] ServiceWorker notification failed:", e);
                try {
                  new Notification(title, {
                    body: body,
                    icon: "/logo-icon.png",
                  });
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
