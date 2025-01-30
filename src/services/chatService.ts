import { supabase } from "@/integrations/supabase/client";
import { ChatRoom, ChatMessage } from "@/types/chat";

export const chatService = {
  async createDirectChat(currentWorkerId: string, targetWorkerId: string, targetWorkerName: string): Promise<string> {
    // Create chat room
    const { data: newRoom, error: roomError } = await supabase
      .from('chat_rooms')
      .insert({
        name: targetWorkerName,
        type: 'direct'
      })
      .select()
      .single();

    if (roomError) {
      console.error('Error creating chat room:', roomError);
      throw new Error('Failed to create chat room');
    }

    // Add participants
    const { error: participantsError } = await supabase
      .from('chat_room_participants')
      .insert([
        { room_id: newRoom.id, worker_id: currentWorkerId },
        { room_id: newRoom.id, worker_id: targetWorkerId }
      ]);

    if (participantsError) {
      console.error('Error adding participants:', participantsError);
      // Clean up the created room
      await supabase.from('chat_rooms').delete().eq('id', newRoom.id);
      throw new Error('Failed to add participants');
    }

    return newRoom.id;
  },

  async getOrCreateAdminWorker(email: string): Promise<string> {
    const { data: existingWorker, error: workerError } = await supabase
      .from('workers')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (workerError) {
      console.error('Error checking worker:', workerError);
      throw new Error('Failed to check worker status');
    }

    if (existingWorker) {
      return existingWorker.id;
    }

    const { data: newWorker, error: createError } = await supabase
      .from('workers')
      .insert({
        name: 'Admin',
        role: 'Admin',
        email: email,
        status: 'active'
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating admin worker:', createError);
      throw new Error('Failed to create admin worker');
    }

    return newWorker.id;
  },

  async fetchMessages(roomId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:sender_id (
          id,
          name,
          image_url
        )
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    return data.map(message => ({
      id: message.id,
      content: message.content,
      timestamp: message.created_at,
      sender: {
        id: message.sender.id,
        name: message.sender.name,
        avatar: message.sender.image_url
      }
    }));
  },

  async sendMessage(roomId: string, senderId: string, content: string): Promise<void> {
    // First verify the chat room exists
    const { data: chatRoom, error: roomError } = await supabase
      .from('chat_rooms')
      .select('id')
      .eq('id', roomId)
      .maybeSingle();

    if (roomError) {
      console.error('Error checking chat room:', roomError);
      throw new Error('Error checking chat room');
    }

    if (!chatRoom) {
      console.error('Chat room not found:', roomId);
      throw new Error('Chat room not found');
    }

    // Then send the message
    const { error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        room_id: roomId,
        sender_id: senderId,
        content
      });

    if (messageError) {
      console.error('Error sending message:', messageError);
      throw new Error('Failed to send message');
    }
  }
};