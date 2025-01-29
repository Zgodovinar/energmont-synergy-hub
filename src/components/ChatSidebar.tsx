import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Users } from "lucide-react";
import { ChatRoom, ChatUser } from "@/types/chat";

const initialUsers: ChatUser[] = [
  { id: 1, name: "John Smith", role: "Project Manager", isOnline: true },
  { id: 2, name: "Anna Johnson", role: "Senior Engineer", isOnline: true },
  { id: 3, name: "Mike Wilson", role: "Technician", isOnline: false },
];

const initialRooms: ChatRoom[] = [
  { 
    id: 1, 
    name: "Team Chat",
    type: "team",
    participants: [1, 2, 3],
    lastMessage: "Great work everyone!",
    lastMessageTime: new Date(),
    userInfo: null
  }
];

interface ChatSidebarProps {
  onRoomSelect: (room: ChatRoom) => void;
  selectedRoomId?: number;
}

const ChatSidebar = ({ onRoomSelect, selectedRoomId }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState<ChatRoom[]>(initialRooms);

  const createDirectChat = useCallback((user: ChatUser) => {
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

    setRooms(prevRooms => [...prevRooms, newRoom]);
    onRoomSelect(newRoom);
  }, [rooms, onRoomSelect]);

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
            const isUser = 'role' in item;
            const isSelected = !isUser && item.id === selectedRoomId;
            const isDirectChat = !isUser && (item as ChatRoom).type === 'direct';

            return (
              <div
                key={`${isUser ? 'user' : 'room'}-${item.id}`}
                className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer hover:bg-accent ${
                  isSelected ? 'bg-accent' : ''
                }`}
                onClick={() => isUser ? createDirectChat(item as ChatUser) : onRoomSelect(item as ChatRoom)}
              >
                <Avatar>
                  <AvatarImage 
                    src={isUser ? (item as ChatUser).avatar : undefined} 
                    alt={item.name}
                  />
                  <AvatarFallback>
                    {isDirectChat ? (item as ChatRoom).name.charAt(0) : <Users className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {isUser 
                      ? (item as ChatUser).role 
                      : (item as ChatRoom).type === 'direct' && (item as ChatRoom).userInfo
                        ? (item as ChatRoom).userInfo.role
                        : (item as ChatRoom).lastMessage
                    }
                  </p>
                </div>
                {(isUser ? (item as ChatUser).isOnline : (item as ChatRoom).type === 'direct' && (item as ChatRoom).userInfo?.isOnline) && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ChatSidebar;