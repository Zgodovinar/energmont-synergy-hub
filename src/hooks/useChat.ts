import { useState, useCallback, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatRoom, ChatUser, Message } from "@/types/chat";
import { toast } from "sonner";

export const useChat = () => {
  const queryClient = useQueryClient();
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom>();

  // Fetch chat rooms
  const { data: rooms = [] } = useQuery({
    queryKey: ['chat-rooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*');
      
      if (error) throw error;
      return data.map(room => ({
        id: parseInt(room.id),
        name: room.name,
        type: room.type as 'direct' | 'team',
        participants: [],
        lastMessageTime: room.created_at ? new Date(room.created_at) : undefined
      }));
    }
  });

  // Fetch messages for selected room
  const { data: messages = [] } = useQuery({
    queryKey: ['chat-messages', selectedRoom?.id],
    queryFn: async () => {
      if (!selectedRoom) return [];
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', selectedRoom.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data.map(msg => ({
        id: parseInt(msg.id),
        senderId: parseInt(msg.sender_id),
        content: msg.content,
        timestamp: new Date(msg.created_at),
        roomId: parseInt(msg.room_id)
      }));
    },
    enabled: !!selectedRoom
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (newMessage: Omit<Message, 'id' | 'timestamp'>) => {
      const { error } = await supabase
        .from('chat_messages')
        .insert([{
          content: newMessage.content,
          room_id: newMessage.roomId,
          sender_id: newMessage.senderId
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
    },
    onError: () => {
      toast.error("Failed to send message");
    }
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!selectedRoom) return;

    const channel = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${selectedRoom.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedRoom, queryClient]);

  const sendMessage = useCallback((content: string) => {
    if (!selectedRoom) return;
    
    sendMessageMutation.mutate({
      content,
      roomId: selectedRoom.id,
      senderId: 1 // TODO: Replace with actual user ID
    });
  }, [selectedRoom, sendMessageMutation]);

  return {
    rooms,
    messages,
    selectedRoom,
    setSelectedRoom,
    sendMessage
  };
};