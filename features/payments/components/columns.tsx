"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, ArrowUpDown, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PaymentViewDialog } from "./payment-view-dialog";
import { Payment } from "../model";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";

const TransactionIdCell = ({ transactionId }: { transactionId?: string }) => {
  const [copied, setCopied] = useState(false);

  if (!transactionId) return <div className="text-center text-muted-foreground">-</div>;

  const handleCopy = () => {
    navigator.clipboard.writeText(transactionId);
    toast.success("Transaction ID copied to clipboard");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-center gap-2 group">
      <div
        className="font-mono text-xs text-muted-foreground truncate max-w-[120px]"
        title={transactionId}
      >
        {transactionId}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-3 w-3 text-emerald-500" />
        ) : (
          <Copy className="h-3 w-3 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "studentName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
      return <div className="font-medium text-gray-600">{formatted}</div>;
    },
  },
  {
    accessorKey: "yourEarning",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Your Earning
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("yourEarning"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
      return <div className="font-medium text-emerald-600">{formatted}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-center font-medium text-muted-foreground hover:bg-transparent pl-0"
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateVal = row.getValue("createdAt") as string | number;
      if (!dateVal)
        return <div className="text-center text-muted-foreground">-</div>;

      let date: Date;
      const numVal = Number(dateVal);

      if (!isNaN(numVal)) {
        date = new Date(numVal < 10000000000 ? numVal * 1000 : numVal);
      } else {
        date = new Date(dateVal);
      }

      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).toUpperCase();

      return (
        <div className="flex flex-col items-center text-center">
          <span className="font-extrabold italic text-[#0f172a] text-[13px] leading-tight">
            {formattedDate}
          </span>
          <span className="text-[11px] text-[#64748b] font-semibold mt-0.5 tracking-tight">
            {formattedTime}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "transaction_id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Transaction ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <TransactionIdCell transactionId={row.original.transaction_id} />
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const [showDialog, setShowDialog] = useState(false);

      return (
        <>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 bg-indigo-50/80 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-full border border-indigo-100/50 shadow-sm transition-all duration-300 group"
              onClick={() => setShowDialog(true)}
              title="View Payment Details"
            >
              <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
          <PaymentViewDialog
            open={showDialog}
            onOpenChange={setShowDialog}
            payment={row.original}
          />
        </>
      );
    },
  },
];
