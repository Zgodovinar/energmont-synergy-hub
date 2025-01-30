export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  status?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: ChatParticipant;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participants: ChatParticipant[];
}