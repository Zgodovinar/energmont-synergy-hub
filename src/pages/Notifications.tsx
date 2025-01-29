import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bell, Calendar, MessageSquare, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Notification } from "@/types/notification";

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "New Message",
    message: "John Smith sent you a message",
    source: "chat",
    timestamp: "2024-02-20T10:00:00",
    read: false
  },
  {
    id: 2,
    title: "Calendar Reminder",
    message: "Team meeting tomorrow at 2 PM",
    source: "calendar",
    timestamp: "2024-02-20T09:30:00",
    read: false
  },
  {
    id: 3,
    title: "Project Update",
    message: "Solar Installation Project deadline updated",
    source: "project",
    timestamp: "2024-02-20T09:00:00",
    read: true
  }
];

const getSourceIcon = (source: Notification['source']) => {
  switch (source) {
    case 'chat':
      return <MessageSquare className="h-5 w-5" />;
    case 'calendar':
      return <Calendar className="h-5 w-5" />;
    case 'project':
      return <Bell className="h-5 w-5" />;
  }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    toast({
      title: "Success",
      description: "Notification deleted successfully",
    });
  };

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
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start justify-between p-4 rounded-lg ${
                  notification.read ? 'bg-gray-50' : 'bg-blue-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${
                    notification.read ? 'bg-gray-100' : 'bg-blue-100'
                  }`}>
                    {getSourceIcon(notification.source)}
                  </div>
                  <div>
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteNotification(notification.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {filteredNotifications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No notifications found
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Notifications;