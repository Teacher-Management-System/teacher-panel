"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Batch } from "../model";
import { format } from "date-fns";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import batchService from "../api.service";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { AddBatchDialog } from "./add-batch-dialog";

const StatusCell = ({ row, table }: { row: any; table: any }) => {
  const status = row.getValue("status") as string;
  const [showConfirm, setShowConfirm] = useState(false);
  const batch = row.original;

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100/50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-100/50 text-amber-700 border-amber-200";
      case "completed":
        return "bg-blue-100/50 text-blue-700 border-blue-200";
      case "inactive":
        return "bg-rose-100/50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const isChangingToInactive = status === "active";
  const isChangingToActive = status === "inactive";
  const targetStatus = isChangingToInactive ? "inactive" : "active";

  const handleStatusClick = () => {
    if (isChangingToInactive || isChangingToActive) {
      setShowConfirm(true);
    }
  };

  const handleConfirmStatusChange = async () => {
    await batchService.updateStatus(batch.id as number, {
      status: targetStatus,
    });
    toast.success(`Status updated to ${targetStatus}`);
    table.options.meta?.onRefresh?.();
  };

  return (
    <>
      <Badge
        variant="outline"
        className={`capitalize font-medium border px-2.5 py-0.5 rounded-md shadow-sm ${
          isChangingToInactive || isChangingToActive
            ? "cursor-pointer hover:opacity-80"
            : ""
        } ${getStatusStyles(status)}`}
        onClick={handleStatusClick}
      >
        {status}
      </Badge>
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent showCloseButton={false} className="sm:max-w-[425px]">
          <ConfirmDialog
            options={{
              title: "Change Status",
              description: `Are you sure you want to change the status to ${targetStatus}?`,
              confirmText: "Yes, Change",
              cancelText: "Cancel",
              variant: isChangingToInactive ? "destructive" : "success",
              onConfirm: handleConfirmStatusChange,
            }}
            closeModal={(result) => setShowConfirm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

const ActionCell = ({ row, table }: { row: any; table: any }) => {
  const batch = row.original;

  return (
    <div className="flex items-center gap-2">
      <AddBatchDialog
        batch={batch}
        onSuccess={() => table.options.meta?.onRefresh?.()}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            title="Edit Batch"
          >
            <Edit className="h-4 w-4" />
          </Button>
        }
      />
    </div>
  );
};

export const columns: ColumnDef<Batch>[] = [
  {
    accessorFn: (row) => row.teacher?.teacher_id || "N/A",
    id: "teacher_id",
    header: "Teacher ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium text-foreground">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => {
      const dateVal = row.getValue("start_date") as string | number;
      if (!dateVal) return <div className="text-muted-foreground">-</div>;
      try {
        const timestamp =
          typeof dateVal === "number"
            ? dateVal * 1000
            : new Date(dateVal).getTime();
        const date = new Date(timestamp);
        return (
          <div className="text-muted-foreground">{format(date, "PPP")}</div>
        );
      } catch (e) {
        return <div className="text-muted-foreground">{String(dateVal)}</div>;
      }
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row, table }) => <StatusCell row={row} table={table} />,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const dateVal = row.getValue("created_at") as string | number;
      if (!dateVal) return <div className="text-muted-foreground">-</div>;
      try {
        const timestamp =
          typeof dateVal === "number"
            ? dateVal * 1000
            : new Date(dateVal).getTime();
        const date = new Date(timestamp);
        return (
          <div className="text-muted-foreground">{format(date, "PPP")}</div>
        );
      } catch (e) {
        return <div className="text-muted-foreground">{String(dateVal)}</div>;
      }
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => <ActionCell row={row} table={table} />,
  },
];
