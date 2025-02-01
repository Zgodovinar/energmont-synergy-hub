import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useChatRooms } from "@/hooks/useChatRooms";
import { ChatRoom } from "@/types/chat";
import ChatHeader from "./chat/ChatHeader";
import ChatRoomList from "./chat/ChatRoomList";

interface ChatSidebarProps {
  selectedRoom?: ChatRoom;
  onRoomSelect: (room: ChatRoom) => void;
}

const ChatSidebar = ({ selectedRoom, onRoomSelect }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const {
    rooms,
    isLoading,
    createRoom,
    deleteRoom
  } = useChatRooms();

  const handleCreateRoom = async (name: string, participantIds: string[]) => {
    try {
      await createRoom({ name, participantIds });
      toast({
        title: "Success",
        description: "Chat room created successfully",
      });
    } catch (error) {
      console.error("Error creating chat room:", error);
      toast({
        title: "Error",
        description: "Failed to create chat room",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await deleteRoom(roomId);
      toast({
        title: "Success",
        description: "Chat room deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting chat room:", error);
      toast({
        title: "Error",
        description: "Failed to delete chat room",
        variant: "destructive",
      });
    }
  };

  const filteredRooms = rooms?.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  if (isLoading) {
    return (
      <div className="w-80 border-r h-screen p-4">
        <p>Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="w-80 border-r h-screen flex flex-col">
      <ChatHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateRoom={handleCreateRoom}
      />
      <ChatRoomList
        rooms={filteredRooms}
        selectedRoom={selectedRoom}
        onRoomSelect={onRoomSelect}
        onDeleteRoom={handleDeleteRoom}
      />
    </div>
  );
};

export default ChatSidebar;