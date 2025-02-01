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

  // Initialize audio
  useEffect(() => {
    if (!audioRef.current) return;

    // Get the public URL
    const { data: urlData } = supabase
      .storage
      .from('public')
      .getPublicUrl('sounds/notification.mp3');

    if (urlData?.publicUrl) {
      console.log('Setting notification sound URL:', urlData.publicUrl);
      audioRef.current.src = urlData.publicUrl;
      audioRef.current.volume = 0.5;
      audioRef.current.preload = 'auto';
    }

    // Handle user interaction to enable audio
    const enableAudio = () => {
      if (!audioRef.current) return;
      
      audioRef.current.play()
        .then(() => {
          console.log('Audio enabled after user interaction');
          audioRef.current!.pause();
          audioRef.current!.currentTime = 0;
        })
        .catch(error => {
          console.warn('Could not enable audio:', error);
        });
      
      // Remove the listener after first interaction
      document.removeEventListener('click', enableAudio);
    };

    document.addEventListener('click', enableAudio);

    return () => {
      document.removeEventListener('click', enableAudio);
    };
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
          if (audioRef.current) {
            console.log('Attempting to play notification sound...');
            audioRef.current.currentTime = 0;
            audioRef.current.play()
              .catch(error => {
                console.warn('Could not play notification sound:', error);
              });
          }

          // Show toast notification
          toast({
            title: `${getSourceIcon(payload.new.source)} ${payload.new.title}`,
            description: payload.new.message,
            duration: 5000,
            variant: "default",
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