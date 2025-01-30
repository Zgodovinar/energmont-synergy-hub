export type NotificationSource = 'chat' | 'calendar' | 'project';

export interface Notification {
  id: string;
  title: string;
  message: string;
  source: NotificationSource;
  recipient_id?: string;
  read: boolean;
  created_at: string;
}