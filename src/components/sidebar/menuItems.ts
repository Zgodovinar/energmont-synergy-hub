import {
  LayoutDashboard,
  Users,
  FolderKanban,
  BarChart2,
  MessageSquare,
  FolderOpen,
  Calendar as CalendarIcon,
  Package,
  Bell,
} from "lucide-react";

export const menuItems = [
  {
    href: "/",
    icon: LayoutDashboard,
    title: "Dashboard",
  },
  {
    href: "/workers",
    icon: Users,
    title: "Workers",
    adminOnly: true,
  },
  {
    href: "/projects",
    icon: FolderKanban,
    title: "Projects",
    adminOnly: true,
  },
  {
    href: "/analytics",
    icon: BarChart2,
    title: "Analytics",
    adminOnly: true,
  },
  {
    href: "/chat",
    icon: MessageSquare,
    title: "Chat",
  },
  {
    href: "/files",
    icon: FolderOpen,
    title: "Files",
  },
  {
    href: "/calendar",
    icon: CalendarIcon,
    title: "Calendar",
  },
  {
    href: "/items",
    icon: Package,
    title: "Items",
  },
  {
    href: "/notifications",
    icon: Bell,
    title: "Notifications",
  },
];