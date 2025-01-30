import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationList from "@/components/notifications/NotificationList";

const Notifications = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { notifications, isLoading, deleteNotification, markAsRead } = useNotifications();

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Notifications</h1>
        
        <div className="relative w-full mb-6">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search notifications..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Card className="p-6">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading notifications...
            </div>
          ) : (
            <NotificationList
              notifications={filteredNotifications}
              onDelete={deleteNotification}
              onRead={markAsRead}
            />
          )}
        </Card>
      </main>
    </div>
  );
};

export default Notifications;