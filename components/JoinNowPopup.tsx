"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Gem,
  Shield,
  Zap,
  Sparkles,
  Star,
  CheckCircle2,
  Headset,
} from "lucide-react";
import { load, CheckoutOptions } from "@cashfreepayments/cashfree-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface JoinNowPopupProps {
  externalOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function JoinNowPopup({
  externalOpen,
  onOpenChange,
}: JoinNowPopupProps) {
  const { user, status, isLoading } = useAuth();
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync internal state with external prop if provided
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  useEffect(() => {
    if (externalOpen !== undefined) return;
    if (!isLoading && user && status === "pending") {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isLoading, user, status, externalOpen]);

  // Logic to show popup every 10 seconds if it's closed
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isLoading && user && status === "pending" && !open) {
      interval = setInterval(() => {
        setOpen(true);
      }, 40000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, user, status, open]);

  const handlePayNow = async () => {
    setIsProcessing(true);
    try {
      const response = await import("@/features/profile/api.service").then(
        (mod) => mod.default.initiatePayment(),
      );

      if (!response?.payment_session_id) {
        toast.error("Invalid payment session");
        return;
      }

      const cashfree = await load({ mode: "sandbox" });

      const checkoutOptions: CheckoutOptions = {
        paymentSessionId: response.payment_session_id,
        returnUrl: window.location.href,
        redirectTarget: "_self",
        onClose: () => {
          window.location.reload();
          setOpen(false);
        },
      };

      await cashfree.checkout(checkoutOptions);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSupportClick = async () => {
    if (!user?.id) return;
    try {
      const response = await import("@/features/profile/api.service").then(
        (mod) => mod.default.updateStatus(user.id),
      );
      toast.success("Support requested successfully");
    } catch (error) {
      console.error("Support API error:", error);
      toast.error("Failed to request support");
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none bg-transparent">
        <div className="relative w-full bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
          {/* Animated Background Gradients */}
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent -z-10" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse" />

          <div className="p-8 flex flex-col items-center text-center">
            {/* Premium Icon Badge and Support Icon */}
            <div className="relative mb-6 flex items-center justify-center w-full">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-xl shadow-primary/30 rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Gem className="w-10 h-10 text-primary-foreground" />
                </div>
                <Sparkles className="absolute -top-3 -right-3 w-6 h-6 text-yellow-500 animate-bounce" />
              </div>

              <button
                onClick={handleSupportClick}
                className="absolute top-0 right-0 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors hover:scale-110 active:scale-95"
                title="Support"
              >
                <Headset className="w-5 h-5" />
              </button>
            </div>

            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Complete Your Registration
              </DialogTitle>
              <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-base">
                Your account is currently{" "}
                <span className="text-amber-500 font-semibold">Pending</span>.
                Join our premium network of teachers to start managing your
                students and courses.
              </DialogDescription>
            </DialogHeader>

            {/* Feature List */}
            <div className="grid grid-cols-1 gap-3 w-full my-8">
              {[
                {
                  icon: CheckCircle2,
                  text: "Access to Student Management",
                  color: "text-blue-500",
                },
                {
                  icon: Zap,
                  text: "Instant Course Publishing",
                  color: "text-amber-500",
                },
                {
                  icon: Star,
                  text: "Premium Teacher Profile Badge",
                  color: "text-purple-500",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all hover:scale-[1.02]"
                >
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            <DialogFooter className="w-full flex flex-col sm:flex-row gap-3">
              <Button
                disabled={isProcessing}
                onClick={handlePayNow}
                className="w-full h-12 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <>
                    <Gem className="w-5 h-5 mr-2" />
                    Join Now
                  </>
                )}
              </Button>
            </DialogFooter>

            <p className="mt-4 text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] font-bold">
              Secure Payment via Cashfree
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
