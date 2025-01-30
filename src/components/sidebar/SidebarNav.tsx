import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { menuItems } from "./menuItems";

interface SidebarNavProps {
  isAdmin: boolean;
  signOut: () => void;
}

export const SidebarNav = ({ isAdmin, signOut }: SidebarNavProps) => {
  const location = useLocation();

  return (
    <div className="px-3 py-2">
      <div className="space-y-1">
        {menuItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;
          const isActive = location.pathname === item.href;

          return (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              title={item.title}
              isActive={isActive}
            />
          );
        })}
        <Button
          variant="ghost"
          className="w-full justify-start px-4"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          <span className="ml-2">Sign Out</span>
        </Button>
      </div>
    </div>
  );
};