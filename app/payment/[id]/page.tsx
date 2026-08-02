"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { load } from "@cashfreepayments/cashfree-js";
import { paymentService } from "@/features/payment/api.service";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [payment, setPayment] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPaymentDetails();
    }
  }, [id]);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentService.getPaymentDetails(id as string);
      
      // Handle the data object regardless of how deeply nested it is
      const paymentObj = data?.payment || data;
      
      if (!paymentObj || !paymentObj.id) {
        throw new Error("Invalid payment data received.");
      }
      
      setPayment(paymentObj);
    } catch (err: any) {
      setError(err.message || "Failed to load payment details.");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!payment?.payment_session_id && !payment?.gateway_link) {
      toast.error("Payment link is not available. Please contact support.");
      return;
    }
    setProcessing(true);
    try {
      if (payment?.payment_session_id) {
        const cashfree = await load({
          mode: (process.env.NEXT_PUBLIC_CASHFREE_MODE as "sandbox" | "production") || "sandbox",
        });
        await cashfree.checkout({
          paymentSessionId: payment.payment_session_id,
          redirectTarget: "_self",
        });
        return;
      }
      if (payment?.gateway_link) {
        window.location.href = payment.gateway_link;
      }
    } catch (err) {
      console.error("Cashfree Checkout error:", err);
      if (payment?.gateway_link) {
        window.location.href = payment.gateway_link;
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-accent/5">
        <div className="max-w-md w-full bg-card rounded-2xl shadow-xl border border-border p-8 text-center">
          <div className="h-16 w-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Invalid Link</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => router.push("/")} className="rounded-xl w-full">
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  if (!payment) return null;

  const isPaid = payment.status === 'Paid';
  const isExpired = payment.status === 'expired';

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-accent/5">
      <div className="max-w-md w-full bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-primary/5 p-8 text-center border-b border-border">
          <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner ${
            isPaid ? 'bg-emerald-500/10' : 'bg-primary/10'
          }`}>
            {isPaid ? (
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            ) : (
              <CreditCard className="h-8 w-8 text-primary" />
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-foreground mb-1">
            {isPaid ? "Payment Successful" : "Complete Payment"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isPaid ? "Thank you! Your payment has been processed securely." : "Review your details and pay securely."}
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {isExpired ? (
            <div className="text-center">
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl p-4 text-sm font-semibold">
                This payment link has expired.
              </div>
            </div>
          ) : (
            <>
              {/* Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border/50">
                  <span className="text-sm font-medium text-muted-foreground">Student Name</span>
                  <span className="text-sm font-bold">{payment.lead?.name || "N/A"}</span>
                </div>
                {(payment.lead?.course || payment.lead?.label) && (
                  <div className="flex justify-between items-center pb-4 border-b border-border/50">
                    <span className="text-sm font-medium text-muted-foreground">Course</span>
                    <span className="text-sm font-bold">{payment.lead?.course || payment.lead?.label}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pb-4 border-b border-border/50">
                  <span className="text-sm font-medium text-muted-foreground">Base Amount</span>
                  <span className="text-sm font-bold">₹{payment.base_amount}</span>
                </div>
                {payment.discount_percentage > 0 && (
                  <div className="flex justify-between items-center pb-4 border-b border-border/50">
                    <span className="text-sm font-medium text-muted-foreground">Discount Applied</span>
                    <span className="text-sm font-bold text-primary">-{payment.discount_percentage}%</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-bold text-foreground">Total Payable</span>
                  <span className="text-2xl font-black text-primary">₹{payment.final_amount}</span>
                </div>
              </div>

              {/* Action */}
              {!isPaid && (
                <div className="pt-4">
                  <Button 
                    onClick={handlePay} 
                    disabled={processing}
                    className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      `Pay ₹${payment.final_amount}`
                    )}
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground mt-4 flex items-center justify-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    Secure payment powered by Cashfree
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
