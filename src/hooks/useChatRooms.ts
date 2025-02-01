import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
          room_id: room.id,
          worker_id: p.worker.id,
          joined_at: new Date().toISOString(),
          name: p.worker.name,
          avatar: p.worker.image_url
        })),
        lastMessageTime: new Date(room.created_at),
        userInfo: room.type === 'direct' ? {
          isOnline: false,
          role: room.participants[0]?.worker?.role
        } : undefined
      })) as ChatRoom[];
    }
  });

  const createRoomMutation = useMutation({
    mutationFn: async ({ name, participantIds }: { name: string, participantIds: string[] }) => {
      console.log('Creating chat room:', { name, participantIds });
      
      const currentUser = await supabase.auth.getUser();
      if (!currentUser.data.user) {
        throw new Error('Not authenticated');
      }

      // Get or create admin worker record
      const adminWorkerId = await chatService.getOrCreateAdminWorker(currentUser.data.user.email!);

      // Create chat room
      const { data: room, error: roomError } = await supabase
        .from('chat_rooms')
        .insert({ 
          name, 
          type: participantIds.length === 1 ? 'direct' : 'group' 
        })
        .select()
        .single();

      if (roomError) {
        console.error('Error creating chat room:', roomError);
        throw new Error('Failed to create chat room');
      }

      // Add participants including admin
      const participants = [
        { room_id: room.id, worker_id: adminWorkerId },
        ...participantIds.map(workerId => ({
          room_id: room.id,
          worker_id: workerId
        }))
      ];

      const { error: participantsError } = await supabase
        .from('chat_room_participants')
        .insert(participants);

      if (participantsError) {
        console.error('Error adding participants:', participantsError);
        // Clean up the created room
        await supabase.from('chat_rooms').delete().eq('id', room.id);
        throw new Error('Failed to add participants');
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
        description: error instanceof Error ? error.message : "Failed to create chat room",
        variant: "destructive"
      });
    }
  });

  return {
    chatRooms,
    isLoadingRooms,
    createRoom: createRoomMutation.mutateAsync
  };
};