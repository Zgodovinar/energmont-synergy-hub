import Sidebar from "@/components/Sidebar";
import ChatSidebar from "@/components/ChatSidebar";
import ChatWindow from "@/components/ChatWindow";
import { useState } from "react";

const Chat = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Chat</h1>
        <div className="flex h-[calc(100vh-12rem)] bg-white rounded-lg shadow-sm">
          <ChatSidebar
            selectedRoomId={selectedRoomId}
            onRoomSelect={setSelectedRoomId}
          />
          <ChatWindow roomId={selectedRoomId} />
        </div>
      </main>
    </div>
  );
};

export default Chat;