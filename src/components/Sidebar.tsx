import { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const { isAdmin, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const storedState = localStorage.getItem('sidebarCollapsed');
    if (storedState !== null) {
      setIsCollapsed(JSON.parse(storedState));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

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
    <div 
      className={`fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <img 
          src="/lovable-uploads/005d9bc9-9de8-4430-b0cc-12d6bc393294.png" 
          alt="Company Logo" 
          className={`h-8 transition-all duration-300 ${isCollapsed ? 'w-8' : 'w-auto'}`}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="ml-2"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {menuItems.map((item) => {
                if (item.adminOnly && !isAdmin) return null;
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link key={item.href} to={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={`w-full justify-start ${
                        isCollapsed ? 'px-2' : 'px-4'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {!isCollapsed && <span className="ml-2">{item.title}</span>}
                    </Button>
                  </Link>
                );
              })}
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isCollapsed ? 'px-2' : 'px-4'
                }`}
                onClick={signOut}
              >
                <LogOut className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">Sign Out</span>}
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
