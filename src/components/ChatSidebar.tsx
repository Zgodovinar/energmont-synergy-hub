import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { ChatRoom, ChatUser } from "@/types/chat";
import ChatUserItem from "./chat/ChatUserItem";
import ChatRoomItem from "./chat/ChatRoomItem";

const initialUsers: ChatUser[] = [
  { id: 1, name: "John Smith", role: "Project Manager", isOnline: true },
  { id: 2, name: "Anna Johnson", role: "Senior Engineer", isOnline: true },
  { id: 3, name: "Mike Wilson", role: "Technician", isOnline: false },
];

interface ChatSidebarProps {
  rooms: ChatRoom[];
  onRoomSelect: (room: ChatRoom) => void;
  selectedRoomId?: number;
}

const ChatSidebar = ({ rooms, onRoomSelect, selectedRoomId }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = searchQuery
    ? [...initialUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
      ...rooms.filter(room =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
      )]
    : [...rooms, ...initialUsers.filter(user => 
        !rooms.some(room => 
          room.type === 'direct' && 
          room.participants.includes(user.id)
        )
      )];

  const createDirectChat = (user: ChatUser) => {
    const existingRoom = rooms.find(
      room => room.type === 'direct' && 
      room.participants.length === 2 && 
      room.participants.includes(user.id)
    );

    if (existingRoom) {
      onRoomSelect(existingRoom);
      return;
    }

    const newRoom: ChatRoom = {
      id: Math.max(...rooms.map(r => r.id), 0) + 1,
      name: user.name,
      type: 'direct',
      participants: [1, user.id],
      lastMessageTime: new Date(),
      userInfo: {
        isOnline: user.isOnline,
        role: user.role
      }
    };

    onRoomSelect(newRoom);
  };

  return (
    <Card className="w-80 h-full border-r">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search chats..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="p-4 space-y-4">
          {filteredItems.map((item) => {
            if ('role' in item) {
              return (
                <ChatUserItem
                  key={`user-${item.id}`}
                  user={item}
                  onClick={createDirectChat}
                />
              );
            } else {
              return (
                <ChatRoomItem
                  key={`room-${item.id}`}
                  room={item}
                  isSelected={item.id === selectedRoomId}
                  onClick={onRoomSelect}
                />
              );
            }
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ChatSidebar;