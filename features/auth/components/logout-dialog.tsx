"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { useAuth } from "@/hooks/useAuth";

export function LogoutDialog() {
  const { closeModal } = useModal();
  const { logout: authLogout } = useAuth();

  const handleLogout = () => {
    authLogout();
    closeModal();
  };

  return (
    <div className="flex flex-col items-center text-center p-8 bg-background rounded-[40px] border border-border/50 shadow-2xl shadow-black/10 animate-in fade-in zoom-in-95 duration-500 max-w-sm mx-auto">
      {/* Icon Section */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
        <div className="relative w-24 h-24 rounded-[32px] bg-red-500/5 flex items-center justify-center text-red-500 border border-red-500/10 shadow-inner">
          <LogOut className="w-10 h-10" strokeWidth={2.5} />
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-3 mb-10">
        <h3 className="text-3xl font-black text-foreground tracking-tight leading-none">
          Confirm Logout
        </h3>
        <p className="text-sm font-medium text-muted-foreground/70 leading-relaxed max-w-[280px]">
          Are you sure you want to log out? You'll need to sign in again to
          access your dashboard.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full">
        <Button
          onClick={handleLogout}
          className="h-16 rounded-[24px] bg-red-500 hover:bg-red-600 text-white font-bold text-base shadow-2xl shadow-red-500/30 hover:shadow-red-500/40 hover:-translate-y-0.5 active:scale-95 transition-all w-full"
        >
          Yes, Log out
        </Button>
        <Button
          variant="ghost"
          onClick={() => closeModal()}
          className="h-16 rounded-[24px] bg-muted/30 hover:bg-muted text-muted-foreground font-bold text-base hover:-translate-y-0.5 active:scale-95 transition-all w-full"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
