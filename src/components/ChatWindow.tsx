import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, ChatRoom } from "@/types/chat";

interface ChatWindowProps {
  room?: ChatRoom;
}

const initialMessages: Message[] = [
  {
    id: 1,
    senderId: 1,
    content: "Hello team! How's the solar installation project going?",
    timestamp: new Date("2024-03-10T09:00:00"),
    roomId: 1,
  },
  {
    id: 2,
    senderId: 2,
    content: "Going well! We've completed the initial setup.",
    timestamp: new Date("2024-03-10T09:05:00"),
    roomId: 1,
  },
  {
    id: 3,
    senderId: 1,
    content: "Great! Any challenges we should be aware of?",
    timestamp: new Date("2024-03-10T09:10:00"),
    roomId: 1,
  },
];

const ChatWindow = ({ room }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const currentUserId = 1; // This would come from authentication

  const handleSendMessage = () => {
    if (!newMessage.trim() || !room) return;

    const message: Message = {
      id: messages.length + 1,
      senderId: currentUserId,
      content: newMessage,
      timestamp: new Date(),
      roomId: room.id,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredMessages = messages.filter(msg => msg.roomId === room?.id);

  if (!room) {
    return (
      <Card className="flex flex-col h-[calc(100vh-12rem)] items-center justify-center text-gray-500">
        <p>Select a chat to start messaging</p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{room.name}</h2>
        <p className="text-sm text-gray-500">
          {room.type === 'team' ? 'Team Chat' : 'Direct Message'}
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.senderId === currentUserId ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar>
                <AvatarImage src={`/placeholder.svg`} />
                <AvatarFallback>
                  {message.senderId === currentUserId ? "You" : "U" + message.senderId}
                </AvatarFallback>
              </Avatar>
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderId === currentUserId
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
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatWindow;