import { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Plus } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import ChatUserItem from "./chat/ChatUserItem";
import ChatSearch from "./chat/ChatSearch";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChatUser } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";
import { chatService } from "@/services/chatService";
import { useAuth } from "@/hooks/useAuth";

interface ChatSidebarProps {
  selectedRoomId?: string;
  onRoomSelect: (roomId: string) => void;
}

const ChatSidebar = ({ selectedRoomId, onRoomSelect }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { session } = useAuth();

  const { data: workers = [], isLoading: isLoadingWorkers } = useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      console.log('Fetching workers...');
      const { data, error } = await supabase
        .from('workers')
        .select('id, name, role, image_url, status')
        .eq('status', 'active');

      if (error) throw error;

      // Filter out the current user from the workers list
      const currentUserEmail = session?.user?.email;
      return data
        .filter(worker => worker.email !== currentUserEmail)
        .map(worker => ({
          id: worker.id,
          name: worker.name,
          role: worker.role,
          avatar: worker.image_url,
          isOnline: worker.status === 'active'
        })) as ChatUser[];
    },
    enabled: !!session
  });

  const handleUserSelect = async (user: ChatUser) => {
    try {
      // Get current user's worker record
      const currentUser = await supabase.auth.getUser();
      if (!currentUser.data.user) {
        toast({
          title: "Error",
          description: "You must be logged in to start a chat",
          variant: "destructive"
        });
        return;
      }

      // Get or create admin worker record if needed
      const currentWorkerId = await chatService.getOrCreateAdminWorker(currentUser.data.user.email!);
      
      // Get or create direct chat
      const chatId = await chatService.getOrCreateDirectChat(currentWorkerId, user.id);
      onRoomSelect(chatId);
    } catch (error) {
      console.error('Error starting direct chat:', error);
      toast({
        title: "Error",
        description: "Failed to start chat",
        variant: "destructive"
      });
    }
  };

  const filteredWorkers = searchQuery
    ? workers.filter(worker => 
        worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : workers;

  return (
    <div className="w-80 border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Direct Messages</h2>
          <Button
            variant="outline"
            size="icon"
            className="invisible" // Hide the button since we're only doing direct messages
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ChatSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {isLoadingWorkers ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : filteredWorkers.length > 0 ? (
            filteredWorkers.map((worker) => (
              <ChatUserItem
                key={worker.id}
                user={worker}
                onClick={handleUserSelect}
              />
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No workers found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;