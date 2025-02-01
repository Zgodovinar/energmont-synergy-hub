import { supabase } from "@/integrations/supabase/client";
import { SendMessageParams } from "@/types/chat";

export const chatService = {
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
    
    // First, get the room participants excluding the sender
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

    // For each participant, check if they already have an unread notification for this chat
    for (const participant of participants) {
      const { data: existingNotif, error: notifError } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', participant.worker_id)
        .eq('source', 'chat')
        .eq('read', false)
        .ilike('title', `New message from ${sender.name}%`)
        .maybeSingle();

      if (notifError && notifError.code !== 'PGRST116') {
        throw notifError;
      }

      if (existingNotif) {
        // Update existing notification
        const { error: updateError } = await supabase
          .from('notifications')
          .update({
            message: `You have new unread messages from ${sender.name}`,
            created_at: new Date().toISOString() // Update timestamp to bring it to top
          })
          .eq('id', existingNotif.id);

        if (updateError) throw updateError;
      } else {
        // Create new notification
        const { error: insertError } = await supabase
          .from('notifications')
          .insert({
            recipient_id: participant.worker_id,
            title: `New message from ${sender.name}`,
            message: content.length > 50 ? content.substring(0, 47) + '...' : content,
            source: 'chat',
            read: false
          });

        if (insertError) throw insertError;
      }
    }

    return message;
  }
};