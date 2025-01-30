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

      // First get the worker record for the current user from profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', currentUser.data.user.email)
        .maybeSingle();

      if (profileError || !profile) {
        console.error('Error finding profile:', profileError);
        throw new Error('Profile not found');
      }

      // Then get the worker record using the profile id
      const { data: worker, error: workerError } = await supabase
        .from('workers')
        .select('id')
        .eq('email', currentUser.data.user.email)
        .maybeSingle();

      if (workerError || !worker) {
        console.error('Error finding worker record:', workerError);
        throw new Error('Worker record not found. Please make sure you have a worker profile.');
      }

      // Then verify that the room exists and the current worker is a participant
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
        .eq('worker_id', worker.id)
        .maybeSingle();

      if (roomError || !room) {
        console.error('Error verifying chat room:', roomError);
        throw new Error('Chat room not found or you do not have access');
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          content,
          sender_id: worker.id
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