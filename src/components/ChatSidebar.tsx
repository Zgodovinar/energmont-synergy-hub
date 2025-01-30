import { Card } from "@/components/ui/card";
import { ChatRoom } from "@/types/chat";
import ChatSearch from "./chat/ChatSearch";
import ChatList from "./chat/ChatList";
import { useChatSidebar } from "./chat/useChatSidebar";

interface ChatSidebarProps {
  rooms: ChatRoom[];
  onRoomSelect: (room: ChatRoom) => void;
  selectedRoomId?: string;
}

const ChatSidebar = ({ rooms, onRoomSelect, selectedRoomId }: ChatSidebarProps) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    filteredItems, 
    handleUserSelect 
  } = useChatSidebar(rooms, onRoomSelect);

  return (
    <Card className="w-80 h-full border-r">
      <ChatSearch 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <ChatList
        items={filteredItems}
        selectedRoomId={selectedRoomId}
        onRoomSelect={onRoomSelect}
        onUserSelect={handleUserSelect}
      />
    </Card>
  );
};

export default ChatSidebar;