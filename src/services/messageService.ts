import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";

export const messageService = {
  async fetchMessages(roomId: string): Promise<ChatMessage[]> {
    console.log('Fetching messages for room:', roomId);
    
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:sender_id (
          id,
          name,
          image_url
        ),
        file:file_id (
          id,
          name,
          file_url,
          file_type
        )
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    console.log('Fetched messages:', data.length);
    return data.map(message => ({
      id: message.id,
      content: message.content,
      timestamp: message.created_at,
      sender: {
        id: message.sender.id,
        name: message.sender.name,
        avatar: message.sender.image_url
      },
      file: message.file ? {
        id: message.file.id,
        name: message.file.name,
        url: message.file.file_url,
        type: message.file.file_type
      } : undefined
    }));
  },

  async sendMessage(roomId: string, senderId: string, content: string, fileId?: string): Promise<void> {
    console.log('Sending message:', { roomId, senderId, content, fileId });

    const { error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        room_id: roomId,
        sender_id: senderId,
        content,
        file_id: fileId
      });

    if (messageError) {
      console.error('Error sending message:', messageError);
      throw new Error('Failed to send message');
    }

    console.log('Message sent successfully');
  }
};