import { ChatRoom } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatRoomItem from "./ChatRoomItem";

interface ChatRoomListProps {
  rooms: ChatRoom[];
  selectedRoom?: ChatRoom;
  onRoomSelect: (room: ChatRoom) => void;
  onDeleteRoom: (roomId: string) => void;
}

const ChatRoomList = ({
  rooms,
  selectedRoom,
  onRoomSelect,
  onDeleteRoom
}: ChatRoomListProps) => {
  return (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-2">
        {rooms.map((room) => (
          <ChatRoomItem
            key={room.id}
            room={room}
            isSelected={selectedRoom?.id === room.id}
            onClick={() => onRoomSelect(room)}
            onDelete={() => onDeleteRoom(room.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default ChatRoomList;