import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatRoom, Message } from "@/types/chat";
import ChatMessage from "./chat/ChatMessage";

interface ChatWindowProps {
  room?: ChatRoom;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

const ChatWindow = ({ room, messages, onSendMessage }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState("");
  const currentUserId = 1; // This would come from authentication

  const handleSendMessage = () => {
    if (!newMessage.trim() || !room) return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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

      <ScrollArea className="flex-1 p-4 messages-scroll-area">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === currentUserId}
            />
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