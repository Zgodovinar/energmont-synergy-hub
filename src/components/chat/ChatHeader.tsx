import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import AddChatDialog from "./AddChatDialog";

interface ChatHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateRoom: (name: string, participantIds: string[]) => void;
}

const ChatHeader = ({
  searchQuery,
  onSearchChange,
  onCreateRoom
}: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chat</h2>
        <AddChatDialog onSave={onCreateRoom}>
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </AddChatDialog>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
};

export default ChatHeader;