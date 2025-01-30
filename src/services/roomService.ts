import { supabase } from "@/integrations/supabase/client";

export const roomService = {
  async getOrCreateDirectChat(currentWorkerId: string, targetWorkerId: string): Promise<string> {
    console.log('Getting or creating direct chat:', { currentWorkerId, targetWorkerId });
    
    // First check if a direct chat already exists between these users
    const { data: existingChats } = await supabase
      .from('chat_rooms')
      .select(`
        id,
        chat_room_participants!inner (
          worker_id
        )
      `)
      .eq('type', 'direct');

    // Filter chats that have both participants
    const directChat = existingChats?.find(chat => {
      const participantIds = chat.chat_room_participants.map(p => p.worker_id);
      return participantIds.includes(currentWorkerId) && participantIds.includes(targetWorkerId);
    });

    if (directChat) {
      console.log('Found existing direct chat:', directChat.id);
      return directChat.id;
    }

    // Get worker names for the chat room name
    const { data: workers } = await supabase
      .from('workers')
      .select('name')
      .in('id', [currentWorkerId, targetWorkerId]);

    if (!workers || workers.length !== 2) {
      throw new Error('Could not find worker information');
    }

    const chatName = `${workers[0].name} & ${workers[1].name}`;

    // Create new direct chat
    const { data: newChat, error: chatError } = await supabase
      .from('chat_rooms')
      .insert({
        name: chatName,
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
  }
};