"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2 } from "lucide-react";
import { useNotifications } from "@/context/notification-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { Megaphone } from "lucide-react";

export function NotificationDropdown() {
  const router = useRouter();
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useNotifications();

  const filteredNotifications = notifications.filter(n => !!n.ticket_id || n.type === "announcement");
  const filteredUnreadCount = filteredNotifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: any) => {
    if (notification.type === "announcement" && notification.data) {
      window.dispatchEvent(
        new CustomEvent("new-announcement", {
          detail: notification.data,
        }),
      );
    } else if (notification.ticket_id) {
      markAsRead(notification.id);
      router.push(`/ticket?ticketId=${notification.ticket_id}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full dark:border dark:border-border">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {filteredUnreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white ring-2 ring-white">
              {filteredUnreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center justify-between px-2 py-1">
            <p className="text-sm font-medium leading-none">Notifications</p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  markAllAsRead();
                }}
                disabled={filteredUnreadCount === 0}
                title="Mark all as read"
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-red-500 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  clearNotifications();
                }}
                disabled={notifications.length === 0}
                title="Clear all"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Bell className="mb-2 h-8 w-8 text-muted-foreground opacity-20" />
              <p className="text-xs text-muted-foreground">No new notifications</p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
                <DropdownMenuItem
                key={n.id}
                className={cn(
                  "flex flex-col items-start gap-1 p-3 cursor-pointer focus:bg-accent",
                  !n.read && "bg-accent/30"
                )}
                onSelect={(e) => {
                  e.preventDefault();
                  handleNotificationClick(n);
                }}
              >
                <div className="flex w-full items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    {n.type === "announcement" && (
                      <Megaphone className="h-3 w-3 text-cyan-500" />
                    )}
                    <span className={cn("text-xs font-semibold", !n.read && "text-primary")}>
                      {n.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{n.time}</span>
                </div>
                <div className="flex items-center gap-2 w-full mt-1">
                  <p className="text-xs text-muted-foreground line-clamp-1 flex-1">
                    {n.message}
                  </p>
                  {n.type === "announcement" && (
                    <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 bg-cyan-500/10 text-cyan-600 border-cyan-500/20">
                      Update
                    </Badge>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex justify-center p-2 text-xs font-medium text-primary hover:underline cursor-pointer"
              onSelect={() => router.push("/notifications")}
            >
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
