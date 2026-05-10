import {
  LayoutDashboard,
  MessageCircle,
  Briefcase,
  CheckSquare,
  Bell,
  BarChart3,
  CreditCard,
  Users,
  Settings,
} from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    path: "/member/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Workspace",
    path: "/member/workspace",
    icon: Briefcase,
  },
  {
    title: "Messages",
    path: "/org/messages",
    icon: MessageCircle,
  },
  {
    title: "Tasks",
    path: "/org/tasks",
    icon: CheckSquare,
  },
  {
    title: "Teams",
    path: "/org/teams",
    icon: Users,
  },
  {
    title: "Analytics",
    path: "/org/analytics",
    icon: BarChart3,
  },
  {
    title: "Notifications",
    path: "/org/notifications",
    icon: Bell,
  },

  {
  title: "Billing",
  path: "/org/billing",
  icon: CreditCard,
}, 

  {
    title: "Settings",
    path: "/org/settings",
    icon: Settings,
  },
];