import { useChatRooms } from "./useChatRooms";
import { useChatMessages } from "./useChatMessages";

export const useChat = (roomId?: string) => {
  const { chatRooms, isLoadingRooms, createRoom } = useChatRooms();
  const { messages, isLoadingMessages, sendMessage } = useChatMessages(roomId);

  return {
    chatRooms,
    messages,
    isLoadingRooms,
    isLoadingMessages,
    sendMessage,
    createRoom
  };
};