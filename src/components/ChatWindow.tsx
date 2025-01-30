import { useEffect, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageSquare, Send, UserRound, Paperclip } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/types/chat";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChatWindowProps {
  roomId?: string;
}

interface MessageForm {
  message: string;
  file?: FileList;
}

const ChatWindow = ({ roomId }: ChatWindowProps) => {
  const { messages, sendMessage, chatRooms } = useChat(roomId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, reset, watch } = useForm<MessageForm>();
  const { toast } = useToast();
  const fileInput = watch("file");

  // Find the current chat room
  const currentRoom = chatRooms?.find(room => room.id === roomId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmit = async (data: MessageForm) => {
    if (!roomId || (!data.message.trim() && !data.file?.[0])) return;
    
    try {
      let fileId: string | undefined;
      
      if (data.file?.[0]) {
        const file = data.file[0];
        const fileExt = file.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from('public')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('public')
          .getPublicUrl(filePath);

        // Create file record
        const { data: fileData, error: fileError } = await supabase
          .from('files')
          .insert({
            name: file.name,
            file_url: publicUrlData.publicUrl,
            file_type: file.type,
            size: file.size
          })
          .select()
          .single();

        if (fileError) throw fileError;
        fileId = fileData.id;
      }

      await sendMessage({ 
        roomId, 
        content: data.message,
        fileId
      });

      reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
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
      {/* Chat Header */}
      <div className="p-4 border-b bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <UserRound className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">
              {currentRoom?.name || 'Chat'}
            </h2>
            {currentRoom?.userInfo?.role && (
              <p className="text-sm text-muted-foreground">
                {currentRoom.userInfo.role}
              </p>
            )}
          </div>
          {currentRoom?.userInfo?.isOnline && (
            <span className="ml-auto flex items-center gap-2 text-sm text-green-600">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              Online
            </span>
          )}
        </div>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message: ChatMessage) => (
            <div
              key={message.id}
              className="flex items-start gap-2.5"
            >
              <div className="p-2 bg-primary/10 rounded-full">
                <UserRound className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col gap-1 max-w-[80%]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {message.sender.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-sm text-secondary-foreground">{message.content}</p>
                  {message.file && (
                    <a
                      href={message.file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Paperclip className="h-4 w-4" />
                      {message.file.name}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 border-t bg-white flex gap-2"
      >
        <Input
          {...register("message")}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Input
          type="file"
          {...register("file")}
          className="hidden"
          id="file-upload"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;