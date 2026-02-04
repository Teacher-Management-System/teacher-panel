"use client";

import dynamic from "next/dynamic";

const AdminDashboard = dynamic(
  () => import("@/features/dashboard/components/dashboard"),
  { ssr: false },
);

export default function DashboardPage() {
  return <AdminDashboard />;
}
