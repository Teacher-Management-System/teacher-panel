import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Script from "next/script";
import Header from "@/components/sidebar/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aerophantom - Teacher Panel",
  description: "A Teacher Panel for Aerophantom to manage all the things",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="max-w-[85rem] mx-auto w-full py-2">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
