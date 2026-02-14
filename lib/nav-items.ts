import {
  LayoutDashboard,
  Users,
  CreditCard,
  Bell,
  Settings,
  User,
} from "lucide-react";

export const navData = {
  navGroups: [
    {
      title: "",
      items: [
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
          title: "Payments",
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
      ],
    },
  ],
};
