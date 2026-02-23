"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserCircle, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface CompleteProfilePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CompleteProfilePopup({
  open,
  onOpenChange,
}: CompleteProfilePopupProps) {
  const router = useRouter();

  const handleGoToProfile = () => {
    onOpenChange(false);
    router.push("/profile");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none bg-transparent">
        <div className="relative w-full bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
          {/* Decorative Header Background */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent -z-10" />

          <div className="p-8 flex flex-col items-center text-center">
            {/* Animated Icon Badge */}
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transform rotate-12 hover:rotate-0 transition-all duration-300">
                <UserCircle className="w-10 h-10" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-amber-500 animate-pulse" />
            </div>

            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Profile Incomplete
              </DialogTitle>
              <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed">
                You're just one step away! Please complete your profile details
                and upload documents to unlock the{" "}
                <span className="font-semibold text-primary">Add Student</span>{" "}
                feature.
              </DialogDescription>
            </DialogHeader>

            {/* Why Complete? */}
            <div className="w-full my-8 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center gap-4 text-left">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  Verified Access
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Ensures security and quality for our student network.
                </p>
              </div>
            </div>

            <DialogFooter className="w-full">
              <Button
                onClick={handleGoToProfile}
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] group"
              >
                Complete Profile Now
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </DialogFooter>

            <button
              onClick={() => onOpenChange(false)}
              className="mt-4 text-sm font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
