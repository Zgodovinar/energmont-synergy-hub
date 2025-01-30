export type NotificationSource = 'chat' | 'calendar' | 'project';

export interface Notification {
  id: string;
  title: string;
  message: string;
  source: NotificationSource;
  recipient_id?: string | null;
  read: boolean | null;
  created_at: string | null;
}