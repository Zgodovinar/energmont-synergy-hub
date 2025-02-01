import { useState } from "react";
import { Button } from "./ui/button";
import { Users } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import ChatUserItem from "./chat/ChatUserItem";
import ChatSearch from "./chat/ChatSearch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChatUser } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";
import { chatService } from "@/services/chatService";
import { useAuth } from "@/hooks/useAuth";
import AddChatDialog from "./chat/AddChatDialog";
import ChatList from "./chat/ChatList";

interface ChatSidebarProps {
  selectedRoomId?: string;
  onRoomSelect: (roomId: string) => void;
}

const ChatSidebar = ({ selectedRoomId, onRoomSelect }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddChat, setShowAddChat] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();
  const queryClient = useQueryClient();

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

      const { data: currentWorker } = await supabase
        .from('workers')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (!currentWorker) return [];

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
        type: room.type as "direct" | "group",
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

  const handleDeleteRoom = async (roomId: string) => {
    try {
      const { error: messagesError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('room_id', roomId);

      if (messagesError) throw messagesError;

      const { error: participantsError } = await supabase
        .from('chat_room_participants')
        .delete()
        .eq('room_id', roomId);

      if (participantsError) throw participantsError;

      const { error: roomError } = await supabase
        .from('chat_rooms')
        .delete()
        .eq('id', roomId);

      if (roomError) throw roomError;

      if (selectedRoomId === roomId) {
        onRoomSelect('');
      }

      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });

      toast({
        title: "Success",
        description: "Chat room deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting chat room:', error);
      toast({
        title: "Error",
        description: "Failed to delete chat room",
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

  const allItems = [...filteredRooms, ...filteredWorkers];

  const handleRoomSelect = (room: ChatRoom) => {
    onRoomSelect(room.id);
  };

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

      {isLoadingWorkers || isLoadingRooms ? (
        <div className="p-4 text-center text-gray-500">Loading...</div>
      ) : (
        <ChatList
          items={allItems}
          selectedRoomId={selectedRoomId}
          onRoomSelect={handleRoomSelect}
          onUserSelect={handleUserSelect}
          onRoomDelete={handleDeleteRoom}
        />
      )}

      <AddChatDialog 
        open={showAddChat} 
        onOpenChange={setShowAddChat} 
        onRoomSelect={onRoomSelect}
      />
    </div>
  );
};

export default ChatSidebar;