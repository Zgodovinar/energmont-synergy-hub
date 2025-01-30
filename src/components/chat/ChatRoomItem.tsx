import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { ChatRoom } from "@/types/chat";

interface ChatRoomItemProps {
  room: ChatRoom;
  isSelected: boolean;
  onClick: (room: ChatRoom) => void;
}

const ChatRoomItem = ({ room, isSelected, onClick }: ChatRoomItemProps) => {
  const isDirectChat = room.type === 'direct';

  return (
    <div
      className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer hover:bg-accent ${
        isSelected ? 'bg-accent' : ''
      }`}
      onClick={() => onClick(room)}
    >
      <Avatar>
        <AvatarFallback>
          {isDirectChat ? room.name.charAt(0) : <Users className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{room.name}</p>
        <p className="text-xs text-gray-500 truncate">
          {isDirectChat && room.userInfo
            ? room.userInfo.role
            : room.lastMessage}
        </p>
      </div>
      {isDirectChat && room.userInfo?.isOnline && (
        <div className="w-2 h-2 bg-green-500 rounded-full" />
      )}
    </div>
  );
};

export default ChatRoomItem;