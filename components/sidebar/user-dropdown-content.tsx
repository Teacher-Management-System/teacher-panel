"use client";

import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
// import authService from "@/features/auth/api.service";
import { cookieService } from "@/lib/cookie";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { ChangePasswordForm } from "@/features/profile/components/change-password-form";
import { LogoutDialog } from "@/features/auth/components/logout-dialog";

import { useAuth } from "@/hooks/useAuth";

export function UserDropdownContent({
  user,
}: {
  user: any;
}) {
  const router = useRouter();
  const { openModal } = useModal();
  const { user: authUser } = useAuth(); // or just useAuth() if nothing else is needed, but user might be used elsewhere

  const logout = async () => {
    openModal(
      LogoutDialog,
      {},
      {
        showCloseButton: false,
        className: "bg-transparent border-none shadow-none p-0 max-w-fit",
      },
    );
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
        <div className="flex items-center gap-3 px-3 py-3 text-left">
          <Avatar className="h-10 w-10 rounded-xl border border-border/50 shadow-sm">
            <AvatarImage src={user?.avatar} alt={displayName} />
            <AvatarFallback className="rounded-xl bg-primary text-primary-foreground font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate font-bold text-sm text-foreground">
              {displayName}
            </span>
            <span className="truncate text-xs text-muted-foreground/70 mb-1">
              {user?.email}
            </span>
            {user?.teacher_id && (
              <div className="flex items-center w-fit px-1.5 py-0.5 rounded-md bg-muted/50 border border-border/50">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">
                  #{user.teacher_id}
                </span>
              </div>
            )}
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator className="bg-border/50" />
      <div className="px-2 py-2">
        <p className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">
          Account
        </p>
        <DropdownMenuGroup className="space-y-1 mt-1">
          <DropdownMenuItem
            onClick={() => router.push("/profile")}
            className="flex items-center gap-3 px-2 py-2.5 rounded-xl cursor-pointer focus:bg-accent/50 transition-colors group"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 group-hover:scale-105 transition-transform">
              <User className="w-[18px] h-[18px]" />
            </div>
            <span className="font-semibold text-sm text-foreground/90">
              My Profile
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => openModal(ChangePasswordForm)}
            className="flex items-center gap-3 px-2 py-2.5 rounded-xl cursor-pointer focus:bg-accent/50 transition-colors group"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-500/10 text-zinc-500 group-hover:scale-105 transition-transform">
              <Lock className="w-[18px] h-[18px]" />
            </div>
            <span className="font-semibold text-sm text-foreground/90">
              Change Password
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-border/50 my-2" />
        <DropdownMenuItem
          onClick={logout}
          className="flex items-center gap-3 px-2 py-2.5 rounded-xl cursor-pointer focus:bg-red-500/10 text-red-500 transition-colors group"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-500/10 text-red-500 group-hover:scale-105 transition-transform">
            <LogOut className="w-[18px] h-[18px]" />
          </div>
          <span className="font-bold text-sm">Log out</span>
        </DropdownMenuItem>
      </div>
    </>
  );
}
