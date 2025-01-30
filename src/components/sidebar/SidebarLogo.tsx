import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarLogoProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const SidebarLogo = ({ isCollapsed, toggleSidebar }: SidebarLogoProps) => {
  return (
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
  );
};