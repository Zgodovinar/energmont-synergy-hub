import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatRoom, ChatUser } from "@/types/chat";
import ChatUserItem from "./ChatUserItem";
import ChatRoomItem from "./ChatRoomItem";

interface ChatListProps {
  items: (ChatRoom | ChatUser)[];
  selectedRoomId?: string;
  onRoomSelect: (room: ChatRoom) => void;
  onUserSelect: (user: ChatUser) => void;
  onRoomDelete: (roomId: string) => void;
}

const ChatList = ({ items, selectedRoomId, onRoomSelect, onUserSelect, onRoomDelete }: ChatListProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="p-4 space-y-4">
        {items.map((item) => {
          if ('role' in item) {
            return (
              <ChatUserItem
                key={`user-${item.id}`}
                user={item}
                onClick={onUserSelect}
              />
            );
          } else {
            return (
              <ChatRoomItem
                key={`room-${item.id}`}
                room={item}
                isSelected={item.id === selectedRoomId}
                onClick={() => onRoomSelect(item)}
                onDelete={onRoomDelete}
              />
            );
          }
        })}
      </div>
    </ScrollArea>
  );
};

export default ChatList;