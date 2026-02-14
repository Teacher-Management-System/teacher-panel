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

export default function PaymentList() {
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
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Earnings & Payments
        </h1>
        <p className="text-muted-foreground">
          Track your earnings and payment history
        </p>
      </div>

      {/* Main Hero Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 p-8 text-white shadow-lg">
        {/* Background decorative circles */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

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

          <div className="flex flex-wrap gap-12 border-t border-white/20 pt-3">
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
                <span className="text-lg font-bold">{totalPaymentsCount}</span>
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

      {/* Secondary Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-xl border shadow-sm transition-all hover:shadow-md">
          <CardContent className="flex items-center gap-4 px-6">
            <div className="rounded-full bg-cyan-100 p-3 text-cyan-600">
              <IndianRupee className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg. Per Student
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(avgPerStudent)}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border shadow-sm transition-all hover:shadow-md">
          <CardContent className="flex items-center gap-4 px-6">
            <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Verified Payments
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {verifiedPaymentsCount}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border shadow-sm transition-all hover:shadow-md">
          <CardContent className="flex items-center gap-4 px-6">
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                This Month
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(thisMonthEarnings)}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Data Table */}
      <Card className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-blue-400">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by student name..."
              value={search ?? ""}
              onChange={(event) => setSearch(event.target.value)}
              className="border-0 bg-transparent p-0 text-base placeholder:text-muted-foreground focus-visible:ring-0"
            />
          </div>
          <div className="rounded-md bg-background overflow-hidden">
            <DataTable table={table} isLoading={loading} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
