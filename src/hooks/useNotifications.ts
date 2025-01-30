import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/types/notification";

export const useNotifications = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data: worker, error: workerError } = await supabase
        .from('workers')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (workerError) {
        console.error('Error fetching worker:', workerError);
        return [];
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', worker.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch notifications",
          variant: "destructive",
        });
        throw error;
      }

      return data as Notification[];
    },
    enabled: !!session?.user?.id
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Success",
        description: "Notification deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications,
    isLoading,
    deleteNotification: deleteMutation.mutate,
    markAsRead: markAsReadMutation.mutate,
  };
};