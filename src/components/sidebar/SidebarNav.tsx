import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { menuItems } from "./menuItems";
import { useEffect, useMemo } from "react";

interface SidebarNavProps {
  isAdmin: boolean;
  signOut: () => void;
}

export const SidebarNav = ({ isAdmin, signOut }: SidebarNavProps) => {
  const location = useLocation();

  // Memoize the filtered items to prevent unnecessary recalculation
  const visibleItems = useMemo(() => {
    console.log('Computing visible menu items. isAdmin:', isAdmin);
    return menuItems.filter(item => {
      if (!isAdmin) {
        return ['chat', 'notifications'].includes(item.href.replace('/', ''));
      }
      return true;
    });
  }, [isAdmin]); // Only recompute when isAdmin changes

  return (
    <div className="px-3 py-2">
      <div className="space-y-1">
        {visibleItems.map((item) => {
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