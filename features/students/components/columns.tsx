"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Trash, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { load, CheckoutOptions } from "@cashfreepayments/cashfree-js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import studentService from "../api.service";
import { toast } from "sonner";
import { EditStudentDialog } from "./edit-student-dialog";

import { StudentDetailsDialog } from "./student-details-dialog";
import { Student, PaymentStatusResponse } from "@/features/students/model";

export const createColumns = (
  refreshData: () => void,
  isFree: boolean = false,
): ColumnDef<Student>[] => {
  const columns: ColumnDef<Student>[] = [
    {
      id: "select",
      header: ({ table }) => {
        const pendingStudents = table
          .getFilteredRowModel()
          .rows.filter((row) => row.original.status === "pending");
        const allPendingSelected =
          pendingStudents.length > 0 &&
          pendingStudents.every((row) => row.getIsSelected());
        const somePendingSelected = pendingStudents.some((row) =>
          row.getIsSelected(),
        );

        return (
          <Checkbox
            checked={
              allPendingSelected
                ? true
                : somePendingSelected
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={(value) => {
              pendingStudents.forEach((row) => {
                row.toggleSelected(!!value);
              });
            }}
            aria-label="Select all pending students"
          />
        );
      },
      cell: ({ row }) => {
        const student = row.original;
        if (student.status !== "pending") {
          return null;
        }

        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select student"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent pl-0 text-left font-medium text-muted-foreground"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium text-foreground">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent pl-0 text-left font-medium text-muted-foreground"
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
            className="hover:bg-transparent pl-0 w-full justify-center font-medium text-muted-foreground"
          >
            Mobile
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center font-medium">{row.getValue("mobile")}</div>
      ),
    },
    {
      accessorKey: "fathers_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent pl-0 w-full justify-center font-medium text-muted-foreground"
          >
            Father's Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.getValue("fathers_name")}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent pl-0 w-full justify-center font-medium text-muted-foreground"
          >
            Created At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const dateVal = row.getValue("created_at");
        if (!dateVal) return <div className="text-muted-foreground">-</div>;
        const date = new Date(Number(dateVal) * 1000);

        return (
          <div className="text-muted-foreground text-center">
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
      accessorKey: "status",
      header: ({ column }) => (
        <div className="text-muted-foreground font-medium text-center w-full">
          Status
        </div>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const getStatusStyles = (status: string) => {
          switch (status) {
            case "active":
              return "bg-emerald-100/50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
            case "pending":
              return "bg-amber-100/50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
            case "complete":
            case "completed":
              return "bg-blue-100/50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
            case "inactive":
              return "bg-rose-100/50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800";
            default:
              return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
          }
        };

        return (
          <div className="flex justify-center w-full">
            <Badge
              variant="outline"
              className={`capitalize font-medium border px-2.5 py-0.5 rounded-md shadow-sm ${getStatusStyles(status)}`}
            >
              {status}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "payment",
      header: ({ table }) => {
        const selectedPendingRows = table
          .getFilteredSelectedRowModel()
          .rows.filter((row) => row.original.status === "pending");

        if (selectedPendingRows.length === 0) {
          return (
            <div className="text-center font-medium text-muted-foreground w-full">
              Payment
            </div>
          );
        }

        const handleBulkPayment = async () => {
          const studentIds = selectedPendingRows.map((row) => row.original.id);

          if (studentIds.length === 0) {
            toast.error("No students selected");
            return;
          }

          try {
            const response = (await studentService.processPayment(
              studentIds,
            )) as {
              payment_session_id: string;
              order_id: string;
            };
            if (!response?.payment_session_id) {
              throw new Error("No payment session received");
            }
            const cashfree = await load({
              mode: "sandbox",
            });
            let pollInterval: NodeJS.Timeout | null = null;
            let pollCount = 0;
            const maxPolls = 60;

            const startPolling = async (orderId: string) => {
              pollInterval = setInterval(async () => {
                pollCount++;
                try {
                  const statusResponse =
                    (await studentService.verifyPaymentStatus(
                      orderId,
                    )) as PaymentStatusResponse;
                  if (statusResponse?.payment_status === "paid") {
                    if (pollInterval) {
                      clearInterval(pollInterval);
                      pollInterval = null;
                    }
                    refreshData();
                  } else if (statusResponse?.payment_status === "failed") {
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
                  console.error("❌ Error during polling:", error);
                }
              }, 3000);
            };

            const checkoutOptions: CheckoutOptions = {
              paymentSessionId: response.payment_session_id,
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
              startPolling(response?.order_id);
            }, 2000);
          } catch (error) {
            console.error("Payment initiation failed", error);
          }
        };

        return (
          <div className="text-center">
            <Button
              variant="default"
              size="sm"
              className="h-7 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600"
              onClick={(e) => {
                e.stopPropagation();
                handleBulkPayment();
              }}
            >
              Pay Selected ({selectedPendingRows.length})
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const student = row.original;
        const [isLoading, setIsLoading] = useState(false);

        if (student.status !== "pending") return null;

        const handlePayment = async () => {
          setIsLoading(true);
          try {
            const response = (await studentService.processPayment([
              student.id,
            ])) as {
              payment_session_id: string;
              order_id: string;
            };

            if (!response?.payment_session_id) {
              toast.error("Failed to create payment session");
              return;
            }

            const cashfree = await load({
              mode: "sandbox",
            });
            let pollInterval: NodeJS.Timeout | null = null;
            let pollCount = 0;
            const maxPolls = 60;

            const startPolling = async (orderId: string) => {
              pollInterval = setInterval(async () => {
                pollCount++;
                try {
                  const statusResponse =
                    (await studentService.verifyPaymentStatus(orderId)) as any;
                  if (statusResponse?.payment_status === "paid") {
                    if (pollInterval) {
                      clearInterval(pollInterval);
                      pollInterval = null;
                    }
                    refreshData();
                  } else if (statusResponse?.payment_status === "failed") {
                    if (pollInterval) {
                      clearInterval(pollInterval);
                      pollInterval = null;
                    }
                    toast.error("Payment failed");
                  }

                  if (pollCount >= maxPolls) {
                    if (pollInterval) {
                      clearInterval(pollInterval);
                      pollInterval = null;
                    }
                    toast.info(
                      "Payment verification timeout. Please refresh if status doesn't update.",
                    );
                  }
                } catch (error) {
                  console.error("❌ Error during polling:", error);
                }
              }, 3000);
            };

            const checkoutOptions: CheckoutOptions = {
              paymentSessionId: response.payment_session_id,
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
              startPolling(response?.order_id);
            }, 2000);
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        };

        return (
          <div className="flex justify-center">
            <Button
              variant="default"
              size="sm"
              className="h-7 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600"
              onClick={(e) => {
                e.stopPropagation();
                handlePayment();
              }}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Payment"}
            </Button>
          </div>
        );
      },
    },

    {
      id: "actions",
      header: () => (
        <div className="text-right text-muted-foreground font-medium">
          Actions
        </div>
      ),
      cell: ({ row }) => <ActionCell row={row} />,
    },
  ];

  if (isFree) {
    return columns.filter((col) => col.id !== "select" && col.id !== "payment");
  }

  return columns;
};

function ActionCell({ row }: { row: any }) {
  const student = row.original as Student;
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await studentService.deleteStudent(student.id);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete student");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setShowDetailsDialog(true)}>
              <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
              View Details
            </DropdownMenuItem>

            {student.status === "pending" && (
              <>
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="mr-2 h-4 w-4 text-muted-foreground" />
                  Edit Student
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isDeleting}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <EditStudentDialog
        student={student}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={() => window.location.reload()}
      />

      <StudentDetailsDialog
        student={student}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              student
              <span className="font-medium text-foreground">
                {" "}
                {student.name}{" "}
              </span>
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
