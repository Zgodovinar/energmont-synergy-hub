import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarNav } from "./sidebar/SidebarNav";

const Sidebar = () => {
  const { isAdmin, signOut } = useAuth();

  return (
    <div className="flex flex-col h-full bg-background border-r">
      <SidebarLogo />
      <ScrollArea className="flex-1">
        <div className="px-3 py-2">
          <SidebarNav isAdmin={isAdmin} signOut={signOut} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;