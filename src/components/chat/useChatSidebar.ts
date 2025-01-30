import { useState } from "react";
import { ChatRoom, ChatUser } from "@/types/chat";

const initialUsers: ChatUser[] = [
  { 
    id: 'c1c3d45e-6789-4abc-def0-123456789abc', 
    name: "John Smith", 
    role: "Project Manager", 
    isOnline: true 
  },
  { 
    id: 'd2e4f67g-890a-4bcd-ef12-3456789abcde', 
    name: "Anna Johnson", 
    role: "Senior Engineer", 
    isOnline: true 
  },
  { 
    id: 'e3f5g78h-901b-4cde-f234-56789abcdef0', 
    name: "Mike Wilson", 
    role: "Technician", 
    isOnline: false 
  },
];

export const useChatSidebar = (rooms: ChatRoom[], onRoomSelect: (room: ChatRoom) => void) => {
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

  const handleUserSelect = (user: ChatUser) => {
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
      id: crypto.randomUUID(),
      name: user.name,
      type: 'direct',
      participants: ['c1c3d45e-6789-4abc-def0-123456789abc', user.id],
      lastMessageTime: new Date(),
      userInfo: {
        isOnline: user.isOnline,
        role: user.role
      }
    };

    onRoomSelect(newRoom);
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
    handleUserSelect
  };
};