"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Payment } from "../model";
import { CheckCircle2, Receipt, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface PaymentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment;
}

export function PaymentViewDialog({
  open,
  onOpenChange,
  payment,
}: PaymentViewDialogProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const dateVal = payment.createdAt as string | number;
  if (!dateVal)
    return <div className="text-center text-muted-foreground">-</div>;

  // Handle both seconds (Unix timestamp) and milliseconds or ISO strings
  let date: Date;
  const numVal = Number(dateVal);

  if (!isNaN(numVal)) {
    // If it's a number, check if it's seconds (small) or ms (large)
    // 10000000000 is roughly year 2286, so anything smaller is likely seconds
    date = new Date(numVal < 10000000000 ? numVal * 1000 : numVal);
  } else {
    date = new Date(dateVal);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-6 rounded-2xl p-6">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0">
          <div className="rounded-lg bg-primary p-2">
            <Receipt className="h-6 w-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Payment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Your Earning Section */}
          <div className="rounded-xl bg-primary/10 p-4">
            <p className="text-sm font-medium text-muted-foreground">Your Earning</p>
            <p className="mt-1 text-3xl font-bold text-primary">
              {formatCurrency(payment.yourEarning)}
            </p>
          </div>

          {/* Amount and Date Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
              <p className="mt-1 text-lg font-bold text-foreground">
                {formatCurrency(payment.amount)}
              </p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="mt-1 text-lg font-bold text-foreground">
                {formatDate(date)}
              </p>
            </div>
          </div>

          {/* Student Section */}
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="text-sm font-medium text-muted-foreground">Students</p>
            <div className="mt-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {payment.studentName}
            </div>
          </div>

          {/* UTR Section */}
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="text-sm font-medium text-muted-foreground">Transaction ID</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="font-mono text-base font-medium text-foreground">
                {payment.transaction_id || "-"}
              </p>
              {payment.transaction_id && (
                <TransactionCopyButton text={payment.transaction_id} />
              )}
            </div>
          </div>

          {/* Verification Status */}
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-500 font-medium">
            <CheckCircle2 className="h-6 w-6" />
            <span className="font-semibold">Payment Verified</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const TransactionCopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success("Transaction ID copied to clipboard");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
};
