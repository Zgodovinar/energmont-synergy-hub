import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";

const Chat = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Chat</h1>
        <ChatWindow />
      </main>
    </div>
  );
};

export default Chat;