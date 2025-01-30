import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  title: string;
  isActive: boolean;
}

export const SidebarItem = ({ 
  href, 
  icon: Icon, 
  title, 
  isActive
}: SidebarItemProps) => {
  return (
    <Link to={href}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className="w-full justify-start px-4"
      >
        <Icon className="h-4 w-4" />
        <span className="ml-2">{title}</span>
      </Button>
    </Link>
  );
};