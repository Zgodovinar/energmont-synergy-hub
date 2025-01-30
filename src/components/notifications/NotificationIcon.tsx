import { Bell, Calendar, MessageSquare } from "lucide-react";
import { NotificationSource } from "@/types/notification";

interface NotificationIconProps {
  source: NotificationSource;
}

export const NotificationIcon = ({ source }: NotificationIconProps) => {
  switch (source) {
    case 'chat':
      return <MessageSquare className="h-5 w-5" />;
    case 'calendar':
      return <Calendar className="h-5 w-5" />;
    case 'project':
      return <Bell className="h-5 w-5" />;
  }
};