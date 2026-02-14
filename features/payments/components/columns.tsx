"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PaymentViewDialog } from "./payment-view-dialog";
import { Payment } from "../model";
import { formatDate } from "@/lib/format";

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
        <div className="text-center text-muted-foreground">
          {date.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
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
      <div
        className="text-center font-mono text-xs text-muted-foreground w-32 truncate"
        title={row.original.transaction_id}
      >
        {row.original.transaction_id || "-"}
      </div>
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
              variant="secondary"
              size="sm"
              className="h-9 bg-cyan-50 font-semibold text-gray-800 hover:bg-cyan-100/80 hover:text-cyan-900 border-0"
              onClick={() => setShowDialog(true)}
            >
              <Eye className="mr-2 h-4 w-4 text-gray-700" />
              View
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
