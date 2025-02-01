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

  // Initialize audio with user interaction
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        if (!audioRef.current) return;
        
        // Get the public URL directly
        const { data: urlData } = supabase
          .storage
          .from('public')
          .getPublicUrl('sounds/notification.mp3');
        
        if (urlData?.publicUrl) {
          console.log('Setting notification sound URL:', urlData.publicUrl);
          audioRef.current.src = urlData.publicUrl;
          
          // Test if audio can be loaded
          await audioRef.current.load();
          // Set volume to 50%
          audioRef.current.volume = 0.5;
          
          // Try to play a silent test to handle autoplay policy
          const playAttempt = await audioRef.current.play();
          if (playAttempt !== undefined) {
            playAttempt.catch(e => {
              console.log('Autoplay prevented, waiting for user interaction:', e);
            });
          }
        }
      } catch (error) {
        console.error('Error initializing audio:', error);
      }
    };

    initializeAudio();
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

          // Show toast notification with longer duration
          toast({
            title: `${getSourceIcon(payload.new.source)} ${payload.new.title}`,
            description: payload.new.message,
            duration: 5000, // Show for 5 seconds
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