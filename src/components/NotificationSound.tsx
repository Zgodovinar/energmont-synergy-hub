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
    // Get the notification sound URL from Supabase storage
    const getNotificationSound = async () => {
      console.log('Fetching notification sound URL...');
      
      // First, list files to debug
      const { data: files, error: listError } = await supabase
        .storage
        .from('public')
        .list('sounds');
      
      console.log('Files in sounds folder:', files);
      
      if (listError) {
        console.error('Error listing files:', listError);
        return;
      }

      const { data } = await supabase
        .storage
        .from('public')
        .getPublicUrl('sounds/notification.mp3');
      
      if (data?.publicUrl && audioRef.current) {
        console.log('Setting notification sound URL:', data.publicUrl);
        audioRef.current.src = data.publicUrl;
        
        // Test if audio can be loaded
        audioRef.current.load();
        audioRef.current.addEventListener('error', (e) => {
          console.error('Error loading audio:', e);
        });
      }
    };

    getNotificationSound();
  }, []);

  useEffect(() => {
    if (!workerId) return;

    console.log('Setting up notification listener for worker:', workerId);

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
            console.log('Attempting to play notification sound...');
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
      console.log('Cleaning up notification listener');
      supabase.removeChannel(channel);
    };
  }, [workerId]);

  return (
    <audio 
      ref={audioRef} 
      preload="auto"
      style={{ display: 'none' }}
    />
  );
};

export default NotificationSound;