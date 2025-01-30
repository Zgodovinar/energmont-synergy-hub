import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChatRoom } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";

export const useChatRooms = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
        type: room.type as 'direct' | 'group',
        participants: room.chat_room_participants.map((p: any) => ({
          id: p.worker.id,
          name: p.worker.name,
          avatar: p.worker.image_url,
          status: p.worker.status
        }))
      }));
    }
  });

  const createRoomMutation = useMutation({
    mutationFn: async ({ name, participantIds }: { name: string; participantIds: string[] }) => {
      console.log('Creating chat room:', { name, participantIds });
      const { data: room, error: roomError } = await supabase
        .from('chat_rooms')
        .insert({ 
          name, 
          type: participantIds.length > 1 ? 'group' : 'direct' 
        })
        .select()
        .single();

      if (roomError) throw roomError;

      const currentUserId = (await supabase.auth.getUser()).data.user?.id;
      if (!currentUserId) throw new Error('No user logged in');

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

  return {
    chatRooms,
    isLoadingRooms,
    createRoom: createRoomMutation.mutate
  };
};