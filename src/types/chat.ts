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

export interface ChatFile {
  id: string;
  name: string;
  file_url: string;  // Changed from url to file_url to match DB
  file_type: string; // Changed from type to file_type to match DB
  size?: number;
  uploaded_by?: string;
  created_at?: string;
  saved_to_files?: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  created_at: string;
  sender: ChatParticipant;
  file?: ChatFile;
  seen?: boolean;
}

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
}

export interface SendMessageParams {
  roomId: string;
  content: string;
  fileId?: string;
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