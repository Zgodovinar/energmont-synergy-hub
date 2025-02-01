export interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participants: ChatParticipant[];
  lastMessageTime?: Date;
  lastMessage?: string;
  userInfo?: {
    isOnline?: boolean;
    role?: string;
  };
}

export interface ChatParticipant {
  room_id: string;
  worker_id: string;
  joined_at: string;
  id?: string; // For backwards compatibility
  name?: string;
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  seen?: boolean;
  sender?: {
    id: string;
    name: string;
    image_url?: string;
  };
  file?: {
    id: string;
    name: string;
    file_url: string;
    file_type?: string;
  };
}

export interface ChatUser {
  id: string;
  name: string;
  role?: string;
  isOnline?: boolean;
  avatar?: string;
  status?: string;
}

export interface SendMessageParams {
  roomId: string;
  content: string;
  fileId?: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
}