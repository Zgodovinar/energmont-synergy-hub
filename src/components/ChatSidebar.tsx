import { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Plus } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import ChatRoomItem from "./chat/ChatRoomItem";
import ChatSearch from "./chat/ChatSearch";
import AddChatDialog from "./chat/AddChatDialog";

interface ChatSidebarProps {
  selectedRoomId?: string;
  onRoomSelect: (roomId: string) => void;
}

const ChatSidebar = ({ selectedRoomId, onRoomSelect }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddChatOpen, setIsAddChatOpen] = useState(false);
  const { chatRooms, isLoadingRooms } = useChat();

  const filteredRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.participants.some(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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
          {isLoadingRooms ? (
            <div className="p-4 text-center text-gray-500">Loading chats...</div>
          ) : filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <ChatRoomItem
                key={room.id}
                room={room}
                isSelected={room.id === selectedRoomId}
                onClick={() => onRoomSelect(room.id)}
              />
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No chats found
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