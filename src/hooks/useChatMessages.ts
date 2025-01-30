import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export const useChatMessages = (roomId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          content,
          sender_id: (await supabase.auth.getUser()).data.user?.id
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
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['chatMessages', roomId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, queryClient]);

  return {
    messages,
    isLoadingMessages,
    sendMessage: sendMessageMutation.mutate
  };
};