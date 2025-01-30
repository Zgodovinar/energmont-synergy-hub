import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarNav } from "./sidebar/SidebarNav";

const Sidebar = () => {
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

  return (
    <div 
      className={`fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <SidebarLogo isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <SidebarNav 
          isCollapsed={isCollapsed} 
          isAdmin={isAdmin} 
          signOut={signOut}
        />
      </ScrollArea>
    </div>
  );
};

export default Sidebar;