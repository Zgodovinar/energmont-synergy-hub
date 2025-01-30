export interface ChatUser {
  id: string;  // Changed from number to string
  name: string;
  role: string;
  avatar?: string;
  isOnline?: boolean;
}

export interface ChatRoom {
  id: string;  // Changed from number to string
  name: string;
  type: 'direct' | 'team';
  participants: string[];  // Changed from number[] to string[]
  lastMessage?: string;
  lastMessageTime?: Date;
  userInfo?: {
    isOnline?: boolean;
    role?: string;
  };
}

export interface Message {
  id: string;  // Changed from number to string
  senderId: string;  // Changed from number to string
  content: string;
  timestamp: Date;
  roomId: string;  // Changed from number to string
}