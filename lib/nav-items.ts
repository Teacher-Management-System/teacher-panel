import {
  LayoutDashboard,
  Users,
  CreditCard,
  Bell,
  Settings,
  User,
  Sparkles,
  Ticket,
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
          title: "Notifications",
          url: "/notifications",
          icon: Bell,
        },
        // {
        //   title: "Settings",
        //   url: "/settings",
        //   icon: Settings,
        // },
        {
          title: "Profile",
          url: "/profile",
          icon: User,
        },
        // {
        //   title: "Ticket",
        //   url: "/ticket",
        //   icon: Ticket,
        // },
      ],
    },
  ],
};
