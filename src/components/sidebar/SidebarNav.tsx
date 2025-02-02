import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { menuItems } from "./menuItems";
import { useEffect, useState } from "react";

interface SidebarNavProps {
  isAdmin: boolean;
  signOut: () => void;
}

export const SidebarNav = ({ isAdmin, signOut }: SidebarNavProps) => {
  const location = useLocation();
  const [visibleItems, setVisibleItems] = useState(menuItems);

  // Only update visible items when isAdmin changes
  useEffect(() => {
    console.log('Updating visible menu items. isAdmin:', isAdmin);
    const filteredItems = menuItems.filter(item => {
      if (!isAdmin) {
        return ['chat', 'notifications'].includes(item.href.replace('/', ''));
      }
      return true;
    });
    setVisibleItems(filteredItems);
  }, [isAdmin]);

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