import { messageService } from "./messageService";
import { workerService } from "./workerService";

export const chatService = {
  ...messageService,
  ...workerService
};