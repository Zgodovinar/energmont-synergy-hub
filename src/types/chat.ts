export interface ChatUser {
  id: number;
  name: string;
  role: string;
  avatar?: string;
  isOnline?: boolean;
}

export interface ChatRoom {
  id: number;
  name: string;
  type: 'direct' | 'team';
  participants: number[];
  lastMessage?: string;
  lastMessageTime?: Date;
}

export interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: Date;
  roomId: number;
}