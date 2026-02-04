"use client";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { columns, Student } from "./columns";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Clock, Search } from "lucide-react";
import { AddStudentDialog } from "./add-student-dialog";

const data: Student[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul@email.com",
    mobile: "1234567890",
    status: "active",
    fees: 15000,
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya@email.com",
    mobile: "0987654321",
    status: "active",
    fees: 20000,
  },
  {
    id: "3",
    name: "Amit Kumar",
    email: "amit@email.com",
    mobile: "1122334455",
    status: "pending",
    fees: 18000,
  },
  {
    id: "4",
    name: "Sneha Gupta",
    email: "sneha@email.com",
    mobile: "9876543210",
    status: "active",
    fees: 12000,
  },
  {
    id: "5",
    name: "Vikram Singh",
    email: "vikram@email.com",
    mobile: "1122334455",
    status: "inactive",
    fees: 15000,
  },
];

export default function StudentList() {
  const { table } = useDataTable({
    data,
    columns,
    pageCount: 1,
    enableAdvancedFilter: false,
  });

  const totalStudents = data.length;
  const activeStudents = data.filter((s) => s.status === "active").length;
  const pendingStudents = data.filter((s) => s.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage student records and information
          </p>
        </div>
        <AddStudentDialog />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Total Students Card */}
        <Card className="relative overflow-hidden border-none shadow-md">
          <CardContent className="px-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Total Students
                </p>
                <h3 className="mt-2 text-4xl font-bold text-blue-700">
                  {totalStudents}
                </h3>
              </div>
              <div className="rounded-2xl bg-purple-500 p-3 text-white shadow-lg shadow-purple-200">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <div className="h-4 w-1 rounded-full bg-purple-500" />
              <p className="text-sm text-gray-500">+20.1% from last month</p>
            </div>
          </CardContent>
        </Card>

        {/* Active Students Card */}
        <Card className="relative overflow-hidden border-none shadow-md">
          <CardContent className="px-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Active Students
                </p>
                <h3 className="mt-2 text-4xl font-bold text-blue-700">
                  {activeStudents}
                </h3>
              </div>
              <div className="rounded-2xl bg-blue-500 p-3 text-white shadow-lg shadow-blue-200">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <div className="h-4 w-1 rounded-full bg-blue-500" />
              <p className="text-sm text-gray-500">
                Currently active and enrolled
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pending Students Card */}
        <Card className="relative overflow-hidden border-none shadow-md">
          <CardContent className="px-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Pending Students
                </p>
                <h3 className="mt-2 text-4xl font-bold text-blue-700">
                  {pendingStudents}
                </h3>
              </div>
              <div className="rounded-2xl bg-orange-500 p-3 text-white shadow-lg shadow-orange-200">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <div className="h-4 w-1 rounded-full bg-orange-500" />
              <p className="text-sm text-gray-500">
                Awaiting approval or payment
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-blue-400">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, email..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
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
