"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PaymentViewDialog } from "./payment-view-dialog";

export type Payment = {
  id: string;
  studentName: string;
  amount: number;
  yourEarning: number;
  refund: number;
  createdAt: string;
  utr?: string;
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
    accessorKey: "refund",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Refund
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("refund"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
      return <div className="font-medium text-red-500">{formatted}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
