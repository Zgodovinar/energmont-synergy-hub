import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChatRoom } from "@/types/chat";

export const useChatRooms = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: chatRooms = [], isLoading: isLoadingRooms } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: async () => {
      console.log('Fetching chat rooms...');
      const { data: rooms, error } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          participants:chat_room_participants(
            worker:workers(*)
          )
        `);

      if (error) {
        console.error('Error fetching chat rooms:', error);
        throw error;
      }

      return rooms.map(room => ({
        id: room.id,
        name: room.name,
        type: room.type as 'direct' | 'group',
        participants: room.participants.map((p: any) => ({
          id: p.worker.id,
          name: p.worker.name,
          avatar: p.worker.image_url
        })),
        lastMessageTime: new Date(room.created_at)
      })) as ChatRoom[];
    }
  });

  const createRoomMutation = useMutation({
    mutationFn: async ({ name, participantIds }: { name: string, participantIds: string[] }) => {
      console.log('Creating chat room:', { name, participantIds });
      
      // First create the chat room
      const { data: room, error: roomError } = await supabase
        .from('chat_rooms')
        .insert({ name, type: 'direct' })
        .select()
        .single();

      if (roomError) {
        console.error('Error creating chat room:', roomError);
        throw roomError;
      }

      // Then add participants
      const participants = participantIds.map(workerId => ({
        room_id: room.id,
        worker_id: workerId
      }));

      const { error: participantsError } = await supabase
        .from('chat_room_participants')
        .insert(participants);

      if (participantsError) {
        console.error('Error adding participants:', participantsError);
        throw participantsError;
      }

      return room;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      toast({
        title: "Success",
        description: "Chat room created successfully"
      });
    },
    onError: (error) => {
      console.error('Error in createRoom mutation:', error);
      toast({
        title: "Error",
        description: "Failed to create chat room",
        variant: "destructive"
      });
    }
  });

  return {
    chatRooms,
    isLoadingRooms,
    createRoom: createRoomMutation.mutate
  };
};