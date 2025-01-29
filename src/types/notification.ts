export type NotificationSource = 'chat' | 'calendar' | 'project';

export interface Notification {
  id: number;
  title: string;
  message: string;
  source: NotificationSource;
  timestamp: string;
  read: boolean;
}