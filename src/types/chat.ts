export interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participants?: ChatParticipant[];
}

export interface ChatParticipant {
  room_id: string;
  worker_id: string;
  joined_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
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