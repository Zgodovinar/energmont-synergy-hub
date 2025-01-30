import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
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
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const { isAdmin, signOut } = useAuth();

  const menuItems = [
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

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
      <ScrollArea className="h-full">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
            <div className="space-y-1">
              {menuItems.map((item) => {
                if (item.adminOnly && !isAdmin) return null;
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link key={item.href} to={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Button>
                  </Link>
                );
              })}
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;