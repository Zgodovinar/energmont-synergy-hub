import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Notification } from "@/types/notification";
import { NotificationIcon } from "./NotificationIcon";

interface NotificationItemProps {
  notification: Notification;
  onDelete: (id: string) => void;
  onRead: (id: string) => void;
}

const NotificationItem = ({ notification, onDelete, onRead }: NotificationItemProps) => {
  return (
    <div
      className={`flex items-start justify-between p-4 rounded-lg ${
        notification.read ? 'bg-gray-50' : 'bg-blue-50'
      }`}
      onClick={() => onRead(notification.id)}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-full ${
          notification.read ? 'bg-gray-100' : 'bg-blue-100'
        }`}>
          <NotificationIcon source={notification.source} />
        </div>
        <div>
          <h3 className="font-medium">{notification.title}</h3>
          <p className="text-sm text-gray-600">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {notification.created_at && new Date(notification.created_at).toLocaleString()}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification.id);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default NotificationItem;