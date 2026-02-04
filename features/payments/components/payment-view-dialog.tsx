"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Payment } from "./columns";
import { CheckCircle2, Receipt } from "lucide-react";

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-6 rounded-2xl p-6">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0">
          <div className="rounded-lg bg-teal-500 p-2">
            <Receipt className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Payment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Your Earning Section */}
          <div className="rounded-xl bg-teal-50/50 p-4">
            <p className="text-sm font-medium text-gray-500">Your Earning</p>
            <p className="mt-1 text-3xl font-bold text-emerald-500">
              {formatCurrency(payment.yourEarning)}
            </p>
          </div>

          {/* Amount and Date Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                {formatCurrency(payment.amount)}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                {formatDate(payment.createdAt)}
              </p>
            </div>
          </div>

          {/* Student Section */}
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">Students</p>
            <div className="mt-2 inline-flex rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-600">
              {payment.studentName}
            </div>
          </div>

          {/* UTR Section */}
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">UTR Number</p>
            <p className="mt-1 font-mono text-base font-medium text-gray-900">
              {payment.utr || "UTR123456789012"}
            </p>
          </div>

          {/* Verification Status */}
          <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
            <span className="font-semibold">Payment Verified</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
