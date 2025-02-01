import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== href) {
      navigate(href, { replace: true });
    }
  };

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start px-4"
      onClick={handleClick}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="ml-2 truncate">{title}</span>
    </Button>
  );
});

SidebarItem.displayName = "SidebarItem";