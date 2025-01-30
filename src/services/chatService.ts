import { messageService } from "./messageService";
import { roomService } from "./roomService";
import { workerService } from "./workerService";

export const chatService = {
  getOrCreateDirectChat: roomService.getOrCreateDirectChat,
  getOrCreateAdminWorker: workerService.getOrCreateAdminWorker,
  fetchMessages: messageService.fetchMessages,
  sendMessage: messageService.sendMessage
};