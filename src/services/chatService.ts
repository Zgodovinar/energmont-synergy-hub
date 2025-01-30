import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";

export const chatService = {
  async getOrCreateDirectChat(currentWorkerId: string, targetWorkerId: string): Promise<string> {
    console.log('Getting or creating direct chat:', { currentWorkerId, targetWorkerId });
    
    // First check if a direct chat already exists between these users
    const { data: existingChat } = await supabase
      .from('chat_rooms')
      .select(`
        id,
        chat_room_participants!inner (
          worker_id
        )
      `)
      .eq('type', 'direct')
      .contains('chat_room_participants.worker_id', [currentWorkerId, targetWorkerId]);

    if (existingChat && existingChat.length > 0) {
      console.log('Found existing direct chat:', existingChat[0].id);
      return existingChat[0].id;
    }

    // Create new direct chat
    const { data: newChat, error: chatError } = await supabase
      .from('chat_rooms')
      .insert({
        type: 'direct'
      })
      .select()
      .single();

    if (chatError) {
      console.error('Error creating direct chat:', chatError);
      throw new Error('Failed to create direct chat');
    }

    // Add participants
    const { error: participantsError } = await supabase
      .from('chat_room_participants')
      .insert([
        { room_id: newChat.id, worker_id: currentWorkerId },
        { room_id: newChat.id, worker_id: targetWorkerId }
      ]);

    if (participantsError) {
      console.error('Error adding participants:', participantsError);
      // Clean up the created chat
      await supabase.from('chat_rooms').delete().eq('id', newChat.id);
      throw new Error('Failed to add participants');
    }

    console.log('Created new direct chat:', newChat.id);
    return newChat.id;
  },

  async getOrCreateAdminWorker(email: string): Promise<string> {
    console.log('Getting or creating admin worker for:', email);
    
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
      console.log('Found existing worker:', existingWorker.id);
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

    console.log('Created new admin worker:', newWorker.id);
    return newWorker.id;
  },

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
      }
    }));
  },

  async sendMessage(roomId: string, senderId: string, content: string): Promise<void> {
    console.log('Sending message:', { roomId, senderId, content });

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

    console.log('Message sent successfully');
  }
};