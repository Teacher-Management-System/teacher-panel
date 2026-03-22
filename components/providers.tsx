"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NuqsAdapter } from "nuqs/adapters/react";
import { ModalProvider } from "@/components/modal-provider";
import { NotificationProvider } from "@/context/notification-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      forcedTheme="light"
      disableTransitionOnChange
      enableColorScheme
    >
      <TooltipProvider delayDuration={120}>
        <ModalProvider>
          <NotificationProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </NotificationProvider>
        </ModalProvider>
      </TooltipProvider>
    </NextThemesProvider>
  );
}
