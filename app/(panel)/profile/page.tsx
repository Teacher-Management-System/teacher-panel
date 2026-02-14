"use client";

import ProfileTabs from "@/features/profile/components/list";

import ProfileLockedScreen from "@/features/profile/components/ProfileLockedScreen";
import { load, CheckoutOptions } from "@cashfreepayments/cashfree-js";
import { PaymentSession } from "@/features/profile/model";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function ProfilePage() {
  const { isPendingOrInactive, isActive, isLoading, refreshUser } = useAuth();

  const handlePayNow = async () => {
    try {
      const response: PaymentSession | undefined =
        await import("@/features/profile/api.service").then((mod) =>
          mod.default.initiatePayment(),
        );
      console.log(response, "response");

      const cashfree = await load({
        mode: "sandbox",
      });
      let pollInterval: NodeJS.Timeout | null = null;
      let pollCount = 0;
      const maxPolls = 60;

      const startPolling = async () => {
        pollInterval = setInterval(async () => {
          pollCount++;

          try {
            const profileService =
              await import("@/features/profile/api.service").then(
                (mod) => mod.default,
              );

            const statusResponse =
              (await profileService.verifyPaymentStatus()) as any;

            if (statusResponse?.payment_status === "paid") {
              if (pollInterval) {
                clearInterval(pollInterval);
                pollInterval = null;
              }

              await refreshUser();
            } else if (statusResponse?.payment_status === "failed") {
              console.error("Payment failed. Please try again.");
              if (pollInterval) {
                clearInterval(pollInterval);
                pollInterval = null;
              }
            }

            if (pollCount >= maxPolls) {
              if (pollInterval) {
                clearInterval(pollInterval);
                pollInterval = null;
              }
            }
          } catch (error) {
            toast.error("Failed to verify payment status");
          }
        }, 3000);
      };

      const checkoutOptions: CheckoutOptions = {
        paymentSessionId: response?.payment_session_id || "",
        redirectTarget: "_modal",
        onClose: () => {
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
          }
        },
      };

      cashfree.checkout(checkoutOptions);

      setTimeout(() => {
        startPolling();
      }, 2000);
    } catch (error) {
      toast.error("Failed to initiate payment");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {isPendingOrInactive ? (
        <ProfileLockedScreen onPayNow={handlePayNow} />
      ) : (
        <ProfileTabs />
      )}
    </div>
  );
}
