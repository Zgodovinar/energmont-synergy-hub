import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "@/types/chat";

export const useChatMessages = (roomId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['chatMessages', roomId],
    queryFn: async () => {
      if (!roomId) return [];
      
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

      return data.map(message => ({
        id: message.id,
        content: message.content,
        timestamp: new Date(message.created_at).toISOString(),
        sender: {
          id: message.sender.id,
          name: message.sender.name,
          avatar: message.sender.image_url
        }
      }));
    },
    enabled: !!roomId
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ roomId, content }: { roomId: string; content: string }) => {
      console.log('Sending message:', { roomId, content });
      
      const currentUser = await supabase.auth.getUser();
      if (!currentUser.data.user) {
        throw new Error('Not authenticated');
      }

      // First check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.data.user.id)
        .single();

      if (profileError) {
        console.error('Error checking user role:', profileError);
        throw new Error('Could not verify user role');
      }

      const isAdmin = profile.role === 'admin';
      console.log('User role check:', { isAdmin, profile });

      // First verify that the chat room exists
      const { data: chatRoom, error: chatRoomError } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('id', roomId)
        .maybeSingle();

      if (chatRoomError) {
        console.error('Error finding chat room:', chatRoomError);
        throw new Error('Error checking chat room');
      }

      if (!chatRoom) {
        console.error('Chat room not found:', roomId);
        throw new Error('Chat room not found');
      }

      // If admin, get or create the admin's worker record
      const { data: adminWorker, error: adminWorkerError } = await supabase
        .from('workers')
        .select('id')
        .eq('email', currentUser.data.user.email)
        .maybeSingle();

      if (adminWorkerError) {
        console.error('Error finding admin worker record:', adminWorkerError);
        throw new Error('Could not verify admin worker record');
      }

      // If admin and no worker record found, create one
      let workerId;
      if (isAdmin && !adminWorker) {
        const { data: newWorker, error: createWorkerError } = await supabase
          .from('workers')
          .insert({
            name: 'Admin',
            role: 'Admin',
            email: currentUser.data.user.email,
            status: 'active'
          })
          .select()
          .single();

        if (createWorkerError) {
          console.error('Error creating admin worker record:', createWorkerError);
          throw new Error('Could not create admin worker record');
        }

        workerId = newWorker.id;
      } else {
        workerId = adminWorker?.id;
      }

      // If admin, skip participant check
      if (!isAdmin) {
        // Verify that the current worker is a participant
        const { data: room, error: roomError } = await supabase
          .from('chat_room_participants')
          .select(`
            room_id,
            chat_rooms!inner (
              id,
              name
            )
          `)
          .eq('room_id', roomId)
          .eq('worker_id', workerId)
          .maybeSingle();

        if (roomError || !room) {
          console.error('Error verifying chat room:', roomError);
          throw new Error('Chat room not found or you do not have access');
        }
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          content,
          sender_id: workerId
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', roomId] });
    },
    onError: (error) => {
      console.error('Error in sendMessage mutation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive"
      });
    }
  });

  return {
    messages,
    isLoadingMessages,
    sendMessage: sendMessageMutation.mutate
  };
};