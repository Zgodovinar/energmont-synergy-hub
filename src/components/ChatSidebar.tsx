import { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Plus } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import ChatRoomItem from "./chat/ChatRoomItem";
import ChatSearch from "./chat/ChatSearch";
import AddChatDialog from "./chat/AddChatDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ChatUserItem from "./chat/ChatUserItem";
import { ChatUser } from "@/types/chat";

interface ChatSidebarProps {
  selectedRoomId?: string;
  onRoomSelect: (roomId: string) => void;
}

const ChatSidebar = ({ selectedRoomId, onRoomSelect }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddChatOpen, setIsAddChatOpen] = useState(false);
  const { chatRooms, isLoadingRooms, createRoom } = useChat();

  const { data: workers = [], isLoading: isLoadingWorkers } = useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workers')
        .select('id, name, role, image_url, status')
        .eq('status', 'active');

      if (error) throw error;

      return data.map(worker => ({
        id: worker.id,
        name: worker.name,
        role: worker.role,
        avatar: worker.image_url,
        isOnline: worker.status === 'active'
      })) as ChatUser[];
    }
  });

  const handleUserSelect = async (user: ChatUser) => {
    // Check if a direct chat already exists with this user
    const existingRoom = chatRooms.find(
      room => room.type === 'direct' && 
      room.participants.some(p => p.id === user.id)
    );

    if (existingRoom) {
      onRoomSelect(existingRoom.id);
      return;
    }

    // Create a new direct chat room
    const currentUser = await supabase.auth.getUser();
    if (!currentUser.data.user) return;

    createRoom({
      name: user.name,
      participantIds: [user.id, currentUser.data.user.id]
    });
  };

  const filteredItems = searchQuery
    ? [
        ...workers.filter(worker => 
          worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          worker.role.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        ...chatRooms.filter(room =>
          room.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ]
    : [...workers, ...chatRooms];

  return (
    <div className="w-80 border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Chats</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsAddChatOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ChatSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {isLoadingRooms || isLoadingWorkers ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              'role' in item ? (
                <ChatUserItem
                  key={`user-${item.id}`}
                  user={item}
                  onClick={handleUserSelect}
                />
              ) : (
                <ChatRoomItem
                  key={`room-${item.id}`}
                  room={item}
                  isSelected={item.id === selectedRoomId}
                  onClick={() => onRoomSelect(item.id)}
                />
              )
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No chats or workers found
            </div>
          )}
        </div>
      </ScrollArea>

      <AddChatDialog
        open={isAddChatOpen}
        onOpenChange={setIsAddChatOpen}
      />
    </div>
  );
};

export default ChatSidebar;