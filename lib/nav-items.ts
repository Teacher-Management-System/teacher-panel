import {
  LayoutDashboard,
  Users,
  CreditCard,
  Bell,
  Settings,
  User,
  Sparkles,
  Ticket,
  Megaphone,
} from "lucide-react";

export const navData = {
  navGroups: [
    {
      title: "",
      items: [
        {
          title: "Aero",
          url: "/aero",
          icon: Sparkles,
        },
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Students",
          url: "/students",
          icon: Users,
        },
        {
          title: "Earning & Payments",
          url: "/payments",
          icon: CreditCard,
        },
        {
          title: "Announcements",
          url: "/notifications",
          icon: Megaphone,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
        },
        {
          title: "Profile",
          url: "/profile",
          icon: User,
        },
        {
          title: "Ticket",
          url: "/ticket",
          icon: Ticket,
        },
      ],
    },
  ],
};
