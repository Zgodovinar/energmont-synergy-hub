import { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Plus, Users } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import ChatUserItem from "./chat/ChatUserItem";
import ChatSearch from "./chat/ChatSearch";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChatUser } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";
import { chatService } from "@/services/chatService";
import { useAuth } from "@/hooks/useAuth";
import AddChatDialog from "./chat/AddChatDialog";
import ChatRoomItem from "./chat/ChatRoomItem";

interface ChatSidebarProps {
  selectedRoomId?: string;
  onRoomSelect: (roomId: string) => void;
}

const ChatSidebar = ({ selectedRoomId, onRoomSelect }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddChat, setShowAddChat] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  const { data: workers = [], isLoading: isLoadingWorkers } = useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      console.log('Fetching workers...');
      const { data, error } = await supabase
        .from('workers')
        .select('id, name, role, image_url, status, email')
        .eq('status', 'active');

      if (error) throw error;

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

  const { data: chatRooms = [], isLoading: isLoadingRooms } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: async () => {
      console.log('Fetching chat rooms...');
      if (!session?.user?.email) return [];

      // Get current user's worker record
      const { data: currentWorker } = await supabase
        .from('workers')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (!currentWorker) return [];

      // Fetch all rooms where the current user is a participant
      const { data: rooms, error } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          chat_room_participants!inner (
            worker:workers (*)
          )
        `)
        .eq('chat_room_participants.worker_id', currentWorker.id);

      if (error) {
        console.error('Error fetching chat rooms:', error);
        throw error;
      }

      return rooms.map(room => ({
        id: room.id,
        name: room.name,
        type: room.type,
        participants: room.chat_room_participants.map((p: any) => ({
          id: p.worker.id,
          name: p.worker.name,
          avatar: p.worker.image_url,
          status: p.worker.status
        })),
        lastMessageTime: new Date(room.created_at)
      }));
    },
    enabled: !!session
  });

  const handleUserSelect = async (user: ChatUser) => {
    try {
      const currentUser = await supabase.auth.getUser();
      if (!currentUser.data.user) {
        toast({
          title: "Error",
          description: "You must be logged in to start a chat",
          variant: "destructive"
        });
        return;
      }

      const currentWorkerId = await chatService.getOrCreateAdminWorker(currentUser.data.user.email!);
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

  const filteredRooms = searchQuery
    ? chatRooms.filter(room =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chatRooms;

  return (
    <div className="w-80 border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Messages</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowAddChat(true)}
            className="hover:bg-primary/10"
          >
            <Users className="h-4 w-4" />
          </Button>
        </div>
        <ChatSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {isLoadingWorkers || isLoadingRooms ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : (
            <>
              {filteredRooms.map((room) => (
                <ChatRoomItem
                  key={room.id}
                  room={room}
                  isSelected={room.id === selectedRoomId}
                  onClick={() => onRoomSelect(room.id)}
                />
              ))}
              {filteredWorkers.map((worker) => (
                <ChatUserItem
                  key={worker.id}
                  user={worker}
                  onClick={handleUserSelect}
                />
              ))}
            </>
          )}
        </div>
      </ScrollArea>

      <AddChatDialog 
        open={showAddChat} 
        onOpenChange={setShowAddChat} 
        onRoomSelect={onRoomSelect}
      />
    </div>
  );
};

export default ChatSidebar;