"use client";

import ProfileTabs from "@/features/profile/components/list";

import ProfileLockedScreen from "@/features/profile/components/ProfileLockedScreen";
import { load, CheckoutOptions } from "@cashfreepayments/cashfree-js";
import { PaymentSession } from "@/features/profile/model";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function ProfilePage() {
  const { isPendingOrInactive, isActive, isLoading, refreshUser } = useAuth();

  const router = useRouter();

  const handlePayNow = async () => {
    try {
      const response = await import("@/features/profile/api.service").then(
        (mod) => mod.default.initiatePayment(),
      );

      console.log("Payment session response:", response);

      if (!response?.payment_session_id) {
        toast.error("Invalid payment session");
        return;
      }

      const cashfree = await load({ mode: "sandbox" });

      const checkoutOptions: CheckoutOptions = {
        paymentSessionId: response.payment_session_id,
        returnUrl: `${window.location.origin}/profile`,
        redirectTarget: "_self",
        onClose: () => {
          router.refresh();
        },
      };

      console.log("Opening checkout...");
      await cashfree.checkout(checkoutOptions);
    } catch (error) {
      console.error("Payment error:", error);
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
