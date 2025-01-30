export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  status?: string;
}

export interface ChatUser extends ChatParticipant {
  role: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participants: ChatParticipant[];
  lastMessage?: string;
  lastMessageTime?: Date;
  userInfo?: {
    isOnline?: boolean;
    role?: string;
  };
}