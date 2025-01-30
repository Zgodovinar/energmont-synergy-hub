import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import ChatSidebar from "@/components/ChatSidebar";
import { useChat } from "@/hooks/useChat";

const Chat = () => {
  const { rooms, messages, selectedRoom, setSelectedRoom, sendMessage } = useChat();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Chat</h1>
        <div className="flex gap-8 h-[calc(100vh-12rem)]">
          <ChatSidebar 
            rooms={rooms}
            onRoomSelect={setSelectedRoom}
            selectedRoomId={selectedRoom?.id}
          />
          <div className="flex-1">
            <ChatWindow 
              room={selectedRoom} 
              messages={messages}
              onSendMessage={sendMessage}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;