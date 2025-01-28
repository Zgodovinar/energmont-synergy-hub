import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  BarChart3, 
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const Sidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Users, label: "Workers", path: "/workers" },
    { icon: FolderKanban, label: "Projects", path: "/projects" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: MessageSquare, label: "Chat", path: "/chat" },
  ];

  return (
    <div 
      className={cn(
        "h-screen bg-white border-r border-gray-200 fixed left-0 top-0 p-4 transition-all duration-300",
        isExpanded ? "w-64" : "w-20"
      )}
    >
      <div className="flex items-center justify-between mb-8 px-2">
        {isExpanded && <h1 className="text-2xl font-bold text-primary">Energmont.si</h1>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto"
        >
          {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
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
                : "text-gray-600 hover:bg-gray-100",
              !isExpanded && "justify-center"
            )}
          >
            <item.icon className="w-5 h-5" />
            {isExpanded && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;