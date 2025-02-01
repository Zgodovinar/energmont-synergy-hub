import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { NotificationSource } from '@/types/notification';

const NotificationSound = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { session } = useAuth();

  const { data: workerId } = useQuery({
    queryKey: ['worker-id', session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) return null;
      
      const { data, error } = await supabase
        .from('workers')
        .select('id')
        .eq('email', session.user.email)
        .maybeSingle();
      
      if (error) throw error;
      return data?.id;
    },
    enabled: !!session?.user?.email
  });

  const getSourceIcon = (source: NotificationSource) => {
    switch (source) {
      case 'chat':
        return '💬';
      case 'calendar':
        return '📅';
      case 'project':
        return '📋';
      default:
        return '🔔';
    }
  };

  useEffect(() => {
    if (!workerId) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${workerId}`
        },
        (payload: any) => {
          console.log('New notification received:', payload);
          
          // Play sound
          const audio = audioRef.current;
          if (audio) {
            audio.currentTime = 0;
            audio.play().catch(error => {
              console.error('Error playing notification sound:', error);
            });
          }

          // Show toast notification
          toast({
            title: `${getSourceIcon(payload.new.source)} ${payload.new.title}`,
            description: payload.new.message,
            duration: 5000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workerId]);

  return (
    <audio 
      ref={audioRef} 
      src="/notification.mp3" 
      preload="auto"
    />
  );
};

export default NotificationSound;