import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for events - replace with real data from your backend
const mockEvents = [
  {
    id: 1,
    title: "Team Meeting",
    date: new Date(2024, 3, 15, 10, 0),
    type: "meeting",
  },
  {
    id: 2,
    title: "Project Review",
    date: new Date(2024, 3, 15, 14, 30),
    type: "review",
  },
  // Add more mock events as needed
];

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  // Filter events for the selected date
  const getDayEvents = () => {
    return mockEvents.filter(
      (event) => format(event.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
    );
  };

  // Generate time slots for the day
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute of [0, 30]) {
        slots.push(
          new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            hour,
            minute
          )
        );
      }
    }
    return slots;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Calendar</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Monthly Calendar */}
          <Card className="md:col-span-5">
            <CardHeader>
              <CardTitle>Monthly View</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Daily Schedule */}
          <Card className="md:col-span-7">
            <CardHeader>
              <CardTitle>
                Schedule for {format(selectedDate, "EEEE, MMMM do, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full pr-4">
                <div className="space-y-2">
                  {getTimeSlots().map((timeSlot, index) => {
                    const currentEvents = mockEvents.filter(
                      (event) =>
                        format(event.date, "yyyy-MM-dd HH:mm") ===
                        format(timeSlot, "yyyy-MM-dd HH:mm")
                    );

                    return (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-20 text-sm text-gray-500">
                          {format(timeSlot, "h:mm a")}
                        </div>
                        <div className="flex-1 min-h-[2rem]">
                          {currentEvents.map((event) => (
                            <div
                              key={event.id}
                              className="mb-2 p-2 bg-white rounded-md border shadow-sm"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{event.title}</span>
                                <Badge
                                  variant={event.type === "meeting" ? "default" : "secondary"}
                                >
                                  {event.type}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;