import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bell, Calendar, MessageSquare, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Notification, NotificationSource } from "@/types/notification";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const getSourceIcon = (source: NotificationSource) => {
  switch (source) {
    case 'chat':
      return <MessageSquare className="h-5 w-5" />;
    case 'calendar':
      return <Calendar className="h-5 w-5" />;
    case 'project':
      return <Bell className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
};

const Notifications = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch notifications",
          variant: "destructive",
        });
        throw error;
      }

      return data.map(notification => ({
        ...notification,
        source: notification.source as NotificationSource // Type assertion to ensure source is correct
      }));
    },
  });

  // Delete notification mutation
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

  // Mark as read mutation
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

  // Setup real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleDeleteNotification = (id: string) => {
    deleteMutation.mutate(id);
  };

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Notifications</h1>
        
        <div className="relative w-full mb-6">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search notifications..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Card className="p-6">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading notifications...
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start justify-between p-4 rounded-lg ${
                    notification.read ? 'bg-gray-50' : 'bg-blue-50'
                  }`}
                  onClick={() => markAsReadMutation.mutate(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${
                      notification.read ? 'bg-gray-100' : 'bg-blue-100'
                    }`}>
                      {getSourceIcon(notification.source)}
                    </div>
                    <div>
                      <h3 className="font-medium">{notification.title}</h3>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.created_at && new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {filteredNotifications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No notifications found
                </div>
              )}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Notifications;