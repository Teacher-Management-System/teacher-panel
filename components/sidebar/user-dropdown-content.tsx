"use client";

import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
// import authService from "@/features/auth/api.service";
import { cookieService } from "@/lib/cookie";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export function UserDropdownContent({
  user,
}: {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
  };
}) {
  const router = useRouter();
  const confirm = useConfirm();

  const logout = async () => {
    await confirm({
      title: "Logout",
      variant: "destructive",
      description: "Are you sure you want to logout?",
      confirmText: "Logout",
      cancelText: "Cancel",
      onConfirm: async () => {
        // await authService.logout();
        cookieService.deleteCookie("user");
        cookieService.deleteCookie("authToken");
        router.push("/auth/login");
      },
    });
  };

  const getDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return (user as any)?.name || user?.email?.split("@")[0] || "User";
  };

  const displayName = getDisplayName();
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user?.avatar} alt={displayName} />
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{displayName}</span>
            <span className="truncate text-xs">{user?.email}</span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <User /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/profile/change-password")}
        >
          <Lock /> Change Password
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={logout}>
        <LogOut /> Log out
      </DropdownMenuItem>
    </>
  );
}
