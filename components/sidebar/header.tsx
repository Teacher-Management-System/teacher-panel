"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Profile } from "./profile";
import { ThemeToggle } from "../theme-toggle";
import { NotificationDropdown } from "../notification-dropdown";
import { useAuth } from "@/hooks/useAuth";
import * as React from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger variant="outline" className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </div>
        <div className="flex items-center gap-2 px-4">
          <ThemeToggle />
          <NotificationDropdown />
          {user && <Profile user={user} />}
        </div>
      </div>
    </header>
  );
}
