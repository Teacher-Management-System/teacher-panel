import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardSubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
