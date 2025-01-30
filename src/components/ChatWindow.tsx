import { useEffect, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageSquare, Send } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/types/chat";
import { useForm } from "react-hook-form";

interface ChatWindowProps {
  roomId?: string;
}

interface MessageForm {
  message: string;
}

const ChatWindow = ({ roomId }: ChatWindowProps) => {
  const { messages, sendMessage } = useChat(roomId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, reset } = useForm<MessageForm>();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmit = (data: MessageForm) => {
    if (!roomId || !data.message.trim()) return;
    
    sendMessage({ roomId, content: data.message });
    reset();
  };

  if (!roomId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
        <MessageSquare className="h-12 w-12 mb-4 text-gray-400" />
        <p className="text-lg font-medium mb-2">No chat selected</p>
        <p className="text-sm">Select a worker or chat from the sidebar to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message: ChatMessage) => (
            <div
              key={message.id}
              className="flex items-start gap-2.5"
            >
              <img
                className="w-8 h-8 rounded-full"
                src={message.sender.avatar || "/placeholder.svg"}
                alt={message.sender.name}
              />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {message.sender.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 border-t flex gap-2"
      >
        <Input
          {...register("message")}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;