import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  BarChart3, 
  MessageSquare 
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Users, label: "Workers", path: "/workers" },
    { icon: FolderKanban, label: "Projects", path: "/projects" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: MessageSquare, label: "Chat", path: "/chat" },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0 p-4">
      <div className="flex items-center mb-8 px-2">
        <h1 className="text-2xl font-bold text-primary">Energmont.si</h1>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
              location.pathname === item.path 
                ? "bg-primary text-white" 
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;