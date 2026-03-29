"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NuqsAdapter } from "nuqs/adapters/react";
import { ModalProvider } from "@/components/modal-provider";
import { NotificationProvider } from "@/context/notification-context";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define public routes that should always be in light mode
  const isPublicPage =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/website") ||
    pathname.startsWith("/faq") ||
    pathname.startsWith("/inquiry") ||
    pathname.startsWith("/privacy");

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      forcedTheme={isPublicPage ? "light" : undefined}
    >
      <TooltipProvider delayDuration={120}>
        <AuthProvider>
          <ModalProvider>
            <NotificationProvider>
              <NuqsAdapter>{children}</NuqsAdapter>
            </NotificationProvider>
          </ModalProvider>
        </AuthProvider>
      </TooltipProvider>
    </NextThemesProvider>
  );
}
