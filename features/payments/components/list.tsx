"use client";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wallet,
  TrendingUp,
  Search,
  Calendar,
  IndianRupee,
  FileText,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import paymentService from "../api.service";
import { Payment } from "../model";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { useAuth } from "@/hooks/useAuth";
import { ExportButton } from "@/components/export-button";
import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentList() {
  const { user } = useAuth();
  const isPending = user?.status === "pending";
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [thisMonthEarnings, setThisMonthEarnings] = useState(0);
  const [totalPaymentsCount, setTotalPaymentsCount] = useState(0);
  const [uniqueStudents, setUniqueStudents] = useState(0);
  const [verifiedPaymentsCount, setVerifiedPaymentsCount] = useState(0);

  // NUQS states (URL params)
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10));
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [sort] = useQueryState("sort", parseAsString);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    manual: true,
    enableAdvancedFilter: false,
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
        };

        const response: any = await paymentService.list(queryParams);
        console.log("Payment API Response:", response);

        if (response?.data && Array.isArray(response.data)) {
          const mappedData = response.data.map((item: any) => ({
            id: item.id,
            studentName: item.student?.name || "Unknown",
            amount: parseFloat(item.amount),
            yourEarning: item.earning,
            createdAt: item.created_at,
            transaction_id: item.transaction_id || item.utr,
            status: item.payment_status,
          }));
          setData(mappedData);
        }

        // Update stats from API response
        setTotalEarnings(response?.total_earning ?? 0);
        setThisMonthEarnings(response?.month_earning ?? 0);
        setTotalPaymentsCount(response?.meta?.total_item ?? 0);
        setUniqueStudents(response?.total_student ?? 0); // Using total_student as per response
        setVerifiedPaymentsCount(response?.student_enroll ?? 0); // Using student_enroll as placeholder or correct mapping

        if (response?.meta) {
          const totalPages = Number(response.meta.total_page);
          setPageCount(!isNaN(totalPages) && totalPages > 0 ? totalPages : 1);
        }
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, perPage, search, sort]);

  const avgPerStudent = uniqueStudents > 0 ? totalEarnings / uniqueStudents : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Earnings & Payments
          </h1>
          <p className="text-muted-foreground">
            Track your earnings and payment history
          </p>
        </div>
        <ExportButton
          onExport={() => paymentService.exportData()}
          title="Export Payments"
        />
      </div>

      {/* Main Hero Card */}
      {loading && data.length === 0 ? (
        <div className="relative overflow-hidden rounded-xl bg-muted/30 p-6 sm:p-8 border border-border">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-48" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-4 border-t border-border pt-4 mt-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 p-6 sm:p-8 text-white shadow-lg">
          {/* Background decorative circles */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl opacity-50" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl opacity-50" />

          <div className="relative z-10">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-teal-100">
                    Total Earnings
                  </p>
                  <h2 className="text-4xl font-bold tracking-tight">
                    {formatCurrency(totalEarnings)}
                  </h2>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-12 gap-y-4 border-t border-white/20 pt-4 mt-2">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-teal-200" />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-teal-100">
                    This Month:
                  </span>
                  <span className="text-lg font-bold">
                    {formatCurrency(thisMonthEarnings)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-teal-200" />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-teal-100">
                    Total Payments:
                  </span>
                  <span className="text-lg font-bold">
                    {totalPaymentsCount}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-teal-200" />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-teal-100">
                    Students Enrolled:
                  </span>
                  <span className="text-lg font-bold">{uniqueStudents}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Secondary Stats Cards */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
        {loading && data.length === 0
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="rounded-xl border shadow-sm">
                <CardContent className="flex items-center gap-4 px-6 h-[88px]">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-7 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))
          : [
              {
                label: "Avg. Per Student",
                value: formatCurrency(avgPerStudent),
                icon: IndianRupee,
                color: "cyan",
              },
              {
                label: "Verified Payments",
                value: verifiedPaymentsCount,
                icon: FileText,
                color: "emerald",
              },
              {
                label: "This Month",
                value: formatCurrency(thisMonthEarnings),
                icon: Calendar,
                color: "blue",
              },
            ].map((stat, i) => (
              <Card
                key={i}
                className="rounded-xl border shadow-sm transition-all hover:shadow-md"
              >
                <CardContent className="flex items-center gap-4 px-6 h-[88px]">
                  <div
                    className={`rounded-full p-3 ${
                      stat.color === "cyan"
                        ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                        : stat.color === "emerald"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <h3 className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Main Data Table */}
      <Card className="rounded-xl border bg-card dark:bg-transparent text-card-foreground shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-primary">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by student name..."
              value={search ?? ""}
              onChange={(event) => setSearch(event.target.value)}
              className="border-0 bg-transparent p-0 text-base placeholder:text-muted-foreground focus-visible:ring-0"
            />
          </div>
          <div className="rounded-md bg-background overflow-hidden">
            <DataTable
              table={table}
              isLoading={loading}
              isPending={isPending}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
