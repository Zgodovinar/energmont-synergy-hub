import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarNav } from "./sidebar/SidebarNav";

const Sidebar = () => {
  const { isAdmin, signOut } = useAuth();

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
      <SidebarLogo />
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <SidebarNav isAdmin={isAdmin} signOut={signOut} />
      </ScrollArea>
    </div>
  );
};

export default Sidebar;