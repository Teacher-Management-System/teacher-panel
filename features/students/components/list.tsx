"use client";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { createColumns } from "./columns";
import { Student } from "@/features/students/model";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  Clock,
  Search,
  CheckCircle,
  Filter,
  X,
  CreditCard,
} from "lucide-react";
import { AddStudentDialog } from "./add-student-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import studentService from "../api.service";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { toast } from "sonner";
import { load, CheckoutOptions } from "@cashfreepayments/cashfree-js";
import { useAuth } from "@/hooks/useAuth";
import { PaymentSession } from "@/features/profile/model";

export default function StudentList() {
  const [data, setData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeStudents, setActiveStudents] = useState(0);
  const [pendingStudents, setPendingStudents] = useState(0);
  const [completedStudents, setCompletedStudents] = useState(0);
  // NUQS states (URL params)
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10));
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [sort] = useQueryState("sort", parseAsString);
  const [status, setStatus] = useQueryState("status", parseAsString);
  const [isFree, setIsFree] = useState(false);
  const { refreshUser } = useAuth();

  // Re-fetch when URL params change (or mounts) or when refreshKey changes
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshData = () => setRefreshKey((prev) => prev + 1);

  const { table } = useDataTable({
    data,
    columns: createColumns(refreshData, isFree),
    pageCount,
    manual: true,
    enableAdvancedFilter: false,
    getRowId: (row) => row.id,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = {
          page,
          per_page: perPage,
          search: search || undefined,
          sort: sort || undefined,
          status: status || undefined,
        };

        // Note: Assuming api.service.ts handles the 'status' param correctly in the query string
        const response = await studentService.list(queryParams);
        setTotalStudents(response?.total_students ?? 0);
        setActiveStudents(response?.active_students ?? 0);
        setPendingStudents(response?.pending_students ?? 0);
        setCompletedStudents(response?.completed_students ?? 0);
        setIsFree(response?.is_free ?? false);
        if (response?.students) {
          setData(response.students);
        }
        if (response?.meta) {
          const totalPages = Number(response.meta.total_page);
          setPageCount(!isNaN(totalPages) && totalPages > 0 ? totalPages : 1);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, perPage, search, sort, status, refreshKey]);

  const clearFilters = () => {
    setSearch(null);
    setStatus(null);
  };

  const hasFilters = !!search || !!status;

  // Get selected students
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedStudents = selectedRows.map((row) => row.original);
  const hasSelectedStudents = selectedStudents.length > 0;

  const handleBulkPayment = async () => {
    const studentIds = selectedStudents.map((s) => s.id);
    if (studentIds.length === 0) return;

    setIsPaymentProcessing(true);
    try {
      const response = await studentService.processPayment(studentIds);

      const cashfree = await load({
        mode: "sandbox",
      });

      const checkoutOptions: CheckoutOptions = {
        paymentSessionId: response?.payment_session_id || "",
        redirectTarget: "_modal",
        onSuccess: async (data: any) => {
          console.log("Payment successful:", data);
          await refreshUser();
          toast.success("Payment successful! Refreshing...");
        },
        onFailure: (data: any) => {
          console.error("Payment failed:", data);
        },
      };

      cashfree.checkout(checkoutOptions);
    } catch (error) {
      console.error("Payment initiation failed", error);
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Students
          </h1>
          <p className="text-muted-foreground">
            Manage student records and information
          </p>
        </div>
        <AddStudentDialog onSuccess={refreshData} />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Students",
            value: totalStudents,
            icon: Users,
            color: "blue",
            gradient: "from-blue-600 to-indigo-600",
            lightGradient: "from-blue-50 to-indigo-50",
            border: "border-blue-100",
            textColor: "text-blue-700",
          },
          {
            label: "Active Students",
            value: activeStudents,
            icon: UserCheck,
            color: "emerald",
            gradient: "from-emerald-600 to-teal-600",
            lightGradient: "from-emerald-50 to-teal-50",
            border: "border-emerald-100",
            textColor: "text-emerald-700",
          },
          {
            label: "Pending Students",
            value: pendingStudents,
            icon: Clock,
            color: "amber",
            gradient: "from-amber-500 to-orange-500",
            lightGradient: "from-amber-50 to-orange-50",
            border: "border-amber-100",
            textColor: "text-amber-700",
          },
          {
            label: "Completed",
            value: completedStudents,
            icon: CheckCircle,
            color: "purple",
            gradient: "from-purple-600 to-violet-600",
            lightGradient: "from-purple-50 to-violet-50",
            border: "border-purple-100",
            textColor: "text-purple-700",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className={`relative overflow-hidden border ${stat.border} shadow-sm hover:shadow-md transition-all duration-300 group`}
          >
            {/* Decorative background gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.lightGradient} opacity-40 group-hover:opacity-60 transition-opacity`}
            />

            {/* Decorative large icon */}
            <stat.icon
              className={`absolute -right-6 -bottom-6 h-32 w-32 ${stat.textColor} opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500`}
            />

            <CardContent className="relative">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className={`text-3xl font-bold ${stat.textColor}`}>
                      {stat.value}
                    </h3>
                    <div className="text-xs font-medium text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <span>+12%</span>
                    </div>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg transform group-hover:-translate-y-1 transition-transform`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              {/* Progress indicator decoration */}
              <div className="mt-4 h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${stat.gradient} w-[70%] rounded-full opacity-80`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <CardContent className="p-6 space-y-4">
          {/* Payment Button - Shows when students are selected */}
          {hasSelectedStudents && !isFree && (
            <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {selectedStudents.length} student
                    {selectedStudents.length > 1 ? "s" : ""} selected
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ready for payment processing
                  </p>
                </div>
              </div>
              <Button
                onClick={handleBulkPayment}
                disabled={isPaymentProcessing}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isPaymentProcessing ? "Processing..." : "Process Payment"}
              </Button>
            </div>
          )}

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:max-w-xs w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={search ?? ""}
                  onChange={(event) => setSearch(event.target.value)}
                  className="pl-9 h-9 w-full bg-background border-input focus-visible:ring-1"
                />
              </div>
              <Select
                value={status ?? undefined}
                onValueChange={(val) => setStatus(val === "all" ? null : val)}
              >
                <SelectTrigger className="w-[140px] h-9 border-dashed">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-9 px-2 text-muted-foreground hover:text-primary"
                >
                  Reset
                  <X className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
            {/* Optional: Add "View Options" (Columns toggle) here if needed */}
          </div>

          <div className="rounded-md bg-background overflow-hidden">
            <DataTable table={table} isLoading={loading} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
