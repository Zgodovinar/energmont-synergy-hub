import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { memo } from "react";

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  title: string;
  isActive: boolean;
}

export const SidebarItem = memo(({ 
  href, 
  icon: Icon, 
  title, 
  isActive
}: SidebarItemProps) => {
  return (
    <Link to={href} className="block w-full">
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className="w-full justify-start px-4 transition-none"
        type="button"
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="ml-2 truncate">{title}</span>
      </Button>
    </Link>
  );
});

SidebarItem.displayName = "SidebarItem";