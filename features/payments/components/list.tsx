"use client";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { columns, Payment } from "./columns";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wallet,
  TrendingUp,
  Search,
  CheckCircle,
  Calendar,
  IndianRupee,
  FileText,
  Users,
} from "lucide-react";

const data: Payment[] = [
  {
    id: "1",
    studentName: "Rahul Sharma",
    amount: 15000,
    yourEarning: 12000,
    refund: 0,
    createdAt: "2024-02-01",
  },
  {
    id: "2",
    studentName: "Priya Patel",
    amount: 20000,
    yourEarning: 16000,
    refund: 0,
    createdAt: "2024-02-02",
  },
  {
    id: "3",
    studentName: "Amit Kumar",
    amount: 18000,
    yourEarning: 0,
    refund: 18000,
    createdAt: "2024-02-03",
  },
  {
    id: "4",
    studentName: "Sneha Gupta",
    amount: 12000,
    yourEarning: 9600,
    refund: 0,
    createdAt: "2024-02-03",
  },
  {
    id: "5",
    studentName: "Vikram Singh",
    amount: 15000,
    yourEarning: 12000,
    refund: 0,
    createdAt: "2024-02-04",
  },
];

export default function PaymentList() {
  const { table } = useDataTable({
    data,
    columns,
    pageCount: 1,
    enableAdvancedFilter: false,
  });

  const totalEarnings = data.reduce((acc, curr) => acc + curr.yourEarning, 0);
  const totalPaymentsCount = data.length;
  const uniqueStudents = new Set(data.map((p) => p.studentName)).size;
  const avgPerStudent = uniqueStudents > 0 ? totalEarnings / uniqueStudents : 0;

  // Assuming all mock data is for "This Month" for simplicity in this demo
  const thisMonthEarnings = totalEarnings;
  const verifiedPaymentsCount = data.filter((p) => p.refund === 0).length;

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
              value={
                (table.getColumn("studentName")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("studentName")
                  ?.setFilterValue(event.target.value)
              }
              className="border-0 bg-transparent p-0 text-base placeholder:text-muted-foreground focus-visible:ring-0"
            />
          </div>
          <div className="rounded-md border [&_thead_tr]:bg-rose-50/50 [&_thead_tr]:border-b-rose-100">
            <DataTable table={table} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
