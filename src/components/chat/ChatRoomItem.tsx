import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, Users } from "lucide-react";
import { ChatRoom } from "@/types/chat";

interface ChatRoomItemProps {
  room: ChatRoom;
  isSelected: boolean;
  onClick: () => void;
  onDelete: (roomId: string) => void;
}

const ChatRoomItem = ({ room, isSelected, onClick, onDelete }: ChatRoomItemProps) => {
  const isDirectChat = room.type === 'direct';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the onClick of the parent div
    onDelete(room.id);
  };

  return (
    <div
      className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer hover:bg-accent ${
        isSelected ? 'bg-accent' : ''
      }`}
      onClick={onClick}
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
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ChatRoomItem;