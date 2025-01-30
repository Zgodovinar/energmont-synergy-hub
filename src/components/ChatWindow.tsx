import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageSquare, Send, UserRound, Paperclip } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import FilePreview from "./chat/FilePreview";
import MessageDisplay from "./chat/MessageDisplay";

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
  const { register, handleSubmit, reset, watch, setValue } = useForm<MessageForm>();
  const { toast } = useToast();
  const fileInput = watch("file");
  const { isAdmin } = useAuth();
  const [selectedFileId, setSelectedFileId] = useState<string>();

  const currentRoom = chatRooms?.find(room => room.id === roomId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const clearFile = () => {
    setValue("file", undefined);
    setSelectedFileId(undefined);
  };

  const moveToFiles = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('files')
        .update({ saved_to_files: true })
        .eq('id', fileId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "File saved to Files page",
      });
    } catch (error) {
      console.error('Error saving file:', error);
      toast({
        title: "Error",
        description: "Failed to save file",
        variant: "destructive"
      });
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive"
      });
    }
  };

  const onSubmit = async (data: MessageForm) => {
    if (!roomId || (!data.message.trim() && !data.file?.[0])) return;
    
    try {
      let fileId: string | undefined;
      
      if (data.file?.[0]) {
        const file = data.file[0];
        const fileExt = file.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('public')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('public')
          .getPublicUrl(filePath);

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
        setSelectedFileId(fileData.id);
      }

      await sendMessage({ 
        roomId, 
        content: data.message,
        fileId
      });

      clearFile();
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
          {messages.map((message) => (
            <MessageDisplay
              key={message.id}
              message={message}
              onMoveToFiles={moveToFiles}
              onDeleteFile={deleteFile}
            />
          ))}
        </div>
      </ScrollArea>

      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 border-t bg-white"
      >
        {fileInput?.[0] && (
          <FilePreview
            file={fileInput[0]}
            fileId={selectedFileId}
            onClear={clearFile}
            isAdmin={isAdmin}
          />
        )}
        <div className="flex gap-2">
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
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;