import { supabase } from "@/integrations/supabase/client";
import { NotificationSource } from "@/types/notification";

export const notificationService = {
  async createNotification(
    recipientId: string,
    title: string,
    message: string,
    source: NotificationSource
  ) {
    console.log('Creating notification:', { recipientId, title, message, source });
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        recipient_id: recipientId,
        title,
        message,
        source,
        read: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createOrUpdateChatNotification(
    recipientId: string,
    senderName: string,
    content: string
  ) {
    const { data: existingNotif, error: notifError } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', recipientId)
      .eq('source', 'chat')
      .eq('read', false)
      .ilike('title', `New message from ${senderName}%`)
      .maybeSingle();

    if (notifError && notifError.code !== 'PGRST116') {
      throw notifError;
    }

    if (existingNotif) {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({
          message: `You have new unread messages from ${senderName}`,
          created_at: new Date().toISOString()
        })
        .eq('id', existingNotif.id);

      if (updateError) throw updateError;
    } else {
      await this.createNotification(
        recipientId,
        `New message from ${senderName}`,
        content.length > 50 ? content.substring(0, 47) + '...' : content,
        'chat'
      );
    }
  },

  async createCalendarNotification(
    recipientId: string,
    eventTitle: string,
    startTime: Date
  ) {
    const formattedTime = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(startTime);

    await this.createNotification(
      recipientId,
      'Upcoming Event',
      `Event "${eventTitle}" starts at ${formattedTime}`,
      'calendar'
    );
  },

  async createProjectNotification(
    recipientId: string,
    projectName: string,
    action: string
  ) {
    await this.createNotification(
      recipientId,
      'Project Update',
      `Project "${projectName}" has been ${action}`,
      'project'
    );
  }
};