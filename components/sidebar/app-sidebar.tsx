"use client";

import * as React from "react";
import Image from "next/image";
import { GraduationCap, LogOut } from "lucide-react";

import { NavGroup } from "@/components/sidebar/nav-group";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cookieService } from "@/lib/cookie";
import { navData } from "@/lib/nav-items";
import NextImage from "next/image";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const user = cookieService.getCookie("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  return (
    <Sidebar collapsible="icon" {...props} className="bg-white">
      <div className="flex h-full flex-col">
        <SidebarHeader className="h-16 border-b border-gray-100 flex items-center px-6 group-data-[collapsible=icon]:px-0">
          <div className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center">
            <div className="flex items-center justify-center w-12 h-12 flex-shrink-0">
              <NextImage
                src="/logo-icon.png"
                alt="Aerophantom Logo"
                width={100}
                height={100}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-display font-bold text-lg text-gray-900 tracking-tight">
                Aerophantom
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <nav className="flex flex-1 flex-col space-y-4">
            {navData.navGroups.map((group) => (
              <NavGroup key={group.title} {...group} />
            ))}
          </nav>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
