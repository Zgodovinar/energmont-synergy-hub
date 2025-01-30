import { Notification } from "@/types/notification";
import NotificationItem from "./NotificationItem";

interface NotificationListProps {
  notifications: Notification[];
  onDelete: (id: string) => void;
  onRead: (id: string) => void;
}

const NotificationList = ({ notifications, onDelete, onRead }: NotificationListProps) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No notifications found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDelete={onDelete}
          onRead={onRead}
        />
      ))}
    </div>
  );
};

export default NotificationList;