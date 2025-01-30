import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage, ChatRoom } from "@/types/chat";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export const useChat = (roomId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch chat rooms
  const { data: chatRooms = [], isLoading: isLoadingRooms } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: async () => {
      console.log('Fetching chat rooms...');
      const { data: rooms, error } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          chat_room_participants (
            worker:workers (
              id,
              name,
              image_url,
              status
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching chat rooms:', error);
        throw error;
      }

      return rooms.map(room => ({
        id: room.id,
        name: room.name,
        type: room.type,
        participants: room.chat_room_participants.map((p: any) => ({
          id: p.worker.id,
          name: p.worker.name,
          avatar: p.worker.image_url,
          status: p.worker.status
        }))
      }));
    }
  });

  // Fetch messages for a specific room
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

  // Send message mutation
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

  // Create chat room mutation
  const createRoomMutation = useMutation({
    mutationFn: async ({ name, participantIds }: { name: string; participantIds: string[] }) => {
      console.log('Creating chat room:', { name, participantIds });
      const { data: room, error: roomError } = await supabase
        .from('chat_rooms')
        .insert({ name, type: participantIds.length > 1 ? 'group' : 'direct' })
        .select()
        .single();

      if (roomError) throw roomError;

      const currentUserId = (await supabase.auth.getUser()).data.user?.id;
      if (!currentUserId) throw new Error('No user logged in');

      // Add all participants including the current user
      const participants = [...new Set([...participantIds, currentUserId])];
      
      const { error: participantsError } = await supabase
        .from('chat_room_participants')
        .insert(
          participants.map(workerId => ({
            room_id: room.id,
            worker_id: workerId
          }))
        );

      if (participantsError) throw participantsError;

      return room;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      toast({
        title: "Success",
        description: "Chat room created successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create chat room",
        variant: "destructive"
      });
    }
  });

  // Set up real-time subscription for new messages
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
    chatRooms,
    messages,
    isLoadingRooms,
    isLoadingMessages,
    sendMessage: sendMessageMutation.mutate,
    createRoom: createRoomMutation.mutate
  };
};