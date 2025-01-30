import { ChatMessage } from "@/types/chat";
import { UserRound, Paperclip, FolderUp, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface MessageDisplayProps {
  message: ChatMessage;
  onMoveToFiles: (fileId: string) => void;
  onDeleteFile: (fileId: string) => void;
  isLastMessage?: boolean;
}

const MessageDisplay = ({ message, onMoveToFiles, onDeleteFile, isLastMessage }: MessageDisplayProps) => {
  const { isAdmin } = useAuth();

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-2.5">
        <div className="p-2 bg-primary/10 rounded-full">
          <UserRound className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col gap-1 max-w-[80%]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              {message.sender.name}
            </span>
            <span className="text-xs text-gray-500">
              {format(new Date(message.created_at), 'HH:mm')}
            </span>
          </div>
          <div className="bg-secondary rounded-lg p-3">
            <p className="text-sm text-secondary-foreground">{message.content}</p>
            {message.file && (
              <div className="mt-2 flex items-center gap-2">
                <a
                  href={message.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Paperclip className="h-4 w-4" />
                  {message.file.name}
                </a>
                {isAdmin && (
                  <div className="flex items-center gap-2 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onMoveToFiles(message.file!.id)}
                      className="h-6 w-6"
                    >
                      <FolderUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteFile(message.file!.id)}
                      className="h-6 w-6 text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {isLastMessage && (
        <div className="text-xs text-gray-500 ml-12">
          {message.seen ? "Seen" : "Delivered"}
        </div>
      )}
    </div>
  );
};

export default MessageDisplay;