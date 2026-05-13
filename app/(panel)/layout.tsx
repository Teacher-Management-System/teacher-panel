import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Script from "next/script";
import Header from "@/components/sidebar/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { JoinNowPopup } from "@/components/JoinNowPopup";
import NotificationListener from "@/components/notification-listener";
import AnnouncementDialog from "@/components/announcement-dialog";

export const metadata: Metadata = {
  title: {
    default: "Educator Panel",
    template: "%s | Educator Panel",
  },
  description: "Manage your students, batches, and training programs with the Aerophantom Educator Panel.",
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
        <main className="max-w-[87rem] mx-auto w-full px-4 sm:px-6 lg:px-5 py-4 overflow-x-hidden min-w-0">
          {children}
        </main>
      </SidebarInset>
      <NotificationListener />
      <AnnouncementDialog />
      <JoinNowPopup />
    </SidebarProvider>
  );
}
