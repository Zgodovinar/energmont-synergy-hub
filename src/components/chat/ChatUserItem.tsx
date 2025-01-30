import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { ChatUser } from "@/types/chat";

interface ChatUserItemProps {
  user: ChatUser;
  onClick: (user: ChatUser) => void;
}

const ChatUserItem = ({ user, onClick }: ChatUserItemProps) => {
  return (
    <div
      className="flex items-center space-x-4 p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors"
      onClick={() => onClick(user)}
    >
      <Avatar>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="bg-primary/10">
          <UserRound className="h-5 w-5 text-primary" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-gray-500 truncate">{user.role}</p>
      </div>
      {user.isOnline && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-xs text-green-600">Online</span>
        </div>
      )}
    </div>
  );
};

export default ChatUserItem;