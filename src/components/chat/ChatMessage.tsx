import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

const ChatMessage = ({ message, isCurrentUser }: ChatMessageProps) => {
  return (
    <div
      className={`flex items-start gap-3 ${
        isCurrentUser ? "flex-row-reverse" : ""
      }`}
    >
      <Avatar>
        <AvatarImage src={`/placeholder.svg`} />
        <AvatarFallback>
          {isCurrentUser ? "You" : "U" + message.senderId}
        </AvatarFallback>
      </Avatar>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isCurrentUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;