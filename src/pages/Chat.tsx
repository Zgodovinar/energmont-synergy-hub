import { useState } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import ChatWindow from "@/components/ChatWindow";

const Chat = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 ml-64">
        <div className="flex h-screen">
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