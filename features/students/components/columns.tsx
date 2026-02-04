"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Trash, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type Student = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  status: "active" | "inactive" | "pending";
  fees: number;
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "mobile",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mobile
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const getStatusStyles = (status: string) => {
        switch (status) {
          case "active":
            return {
              badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
              dot: "bg-emerald-500",
            };
          case "pending":
            return {
              badge: "bg-orange-50 text-orange-700 border-orange-100",
              dot: "bg-orange-500",
            };
          case "inactive":
            return {
              badge: "bg-slate-50 text-slate-700 border-slate-100",
              dot: "bg-slate-500",
            };
          default:
            return {
              badge: "bg-gray-50 text-gray-700 border-gray-100",
              dot: "bg-gray-500",
            };
        }
      };

      const styles = getStatusStyles(status);

      return (
        <Badge
          variant="outline"
          className={`flex w-fit items-center gap-2 rounded-full px-3 py-1 font-normal capitalize ${styles.badge}`}
        >
          <div className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "fees",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("fees"));
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-gray-900"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-gray-900"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
