import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";

export const useChatMessages = (roomId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['chatMessages', roomId],
    queryFn: async () => {
      if (!roomId) return [];
      console.log('Fetching messages for room:', roomId);
      return chatService.fetchMessages(roomId);
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

      // Get or create admin worker record
      const workerId = await chatService.getOrCreateAdminWorker(currentUser.data.user.email!);
      
      await chatService.sendMessage(roomId, workerId, content);
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