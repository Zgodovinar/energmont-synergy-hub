import { supabase } from "@/integrations/supabase/client";
import { notificationService } from "./notificationService";

export const messageService = {
  async fetchMessages(roomId: string) {
    console.log('Fetching messages for room:', roomId);
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:sender_id(
          id,
          name,
          image_url
        ),
        file:file_id(*)
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async sendMessage(roomId: string, senderId: string, content: string, fileId?: string) {
    console.log('Sending message:', { roomId, senderId, content, fileId });
    
    // Get the room participants excluding the sender
    const { data: participants, error: participantsError } = await supabase
      .from('chat_room_participants')
      .select('worker_id')
      .eq('room_id', roomId)
      .neq('worker_id', senderId);

    if (participantsError) throw participantsError;

    // Get sender info
    const { data: sender, error: senderError } = await supabase
      .from('workers')
      .select('name')
      .eq('id', senderId)
      .single();

    if (senderError) throw senderError;

    // Insert the message
    const { data: message, error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        room_id: roomId,
        sender_id: senderId,
        content,
        file_id: fileId
      })
      .select()
      .single();

    if (messageError) throw messageError;

    // Create notifications for participants
    await Promise.all(participants.map(participant => 
      notificationService.createOrUpdateChatNotification(
        participant.worker_id,
        sender.name,
        content
      )
    ));

    return message;
  }
};