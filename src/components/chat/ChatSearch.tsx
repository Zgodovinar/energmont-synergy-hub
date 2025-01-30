import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ChatSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const ChatSearch = ({ searchQuery, onSearchChange }: ChatSearchProps) => {
  return (
    <div className="p-4 border-b">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search chats..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ChatSearch;