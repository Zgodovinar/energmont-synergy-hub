import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
        () => {
          audioRef.current?.play();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workerId]);

  return (
    <audio ref={audioRef} src="/notification.mp3" />
  );
};

export default NotificationSound;