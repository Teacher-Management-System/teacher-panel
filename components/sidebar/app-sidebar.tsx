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
        <SidebarHeader className="h-16 border-b border-gray-100 flex items-center px-6">
          <div className="flex items-center gap-3 w-full">
            <div className="flex items-center justify-center w-12 h-12">
              <NextImage
                src="/logo-icon.png"
                alt="Aerophantom Logo"
                width={100}
                height={100}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
            <div className="flex flex-col">
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
        <SidebarFooter className="p-4 border-t border-gray-100">
          <button
            onClick={() => {
              // Handle logout logic, potentially calling authService.logout()
              // For now just redirect or show toast
              cookieService.deleteCookie("user");
              cookieService.deleteCookie("authToken");
              window.location.href = "/auth/login";
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
