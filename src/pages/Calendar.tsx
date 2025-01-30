import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface Event {
  id: string;
  date: Date;
  time: string;
  notification: string;
  note: string;
}

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const { toast } = useToast();

  const handleAddEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const newEvent: Event = {
      id: Math.random().toString(),
      date: date!,
      time: formData.get("time") as string,
      notification: formData.get("notification") as string,
      note: formData.get("note") as string,
    };

    setEvents([...events, newEvent]);
    toast({
      title: "Event added",
      description: "Your event has been successfully added to the calendar.",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Calendar</h1>
        
        <div className="flex flex-col gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm w-full">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border mx-auto"
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Events for {date?.toLocaleDateString()}
              </h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Event</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddEvent} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Time</label>
                      <Input type="time" name="time" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Notification</label>
                      <Input type="text" name="notification" placeholder="Notification message" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Note</label>
                      <Textarea name="note" placeholder="Add a note..." />
                    </div>
                    <Button type="submit">Save Event</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {events
                .filter((event) => event.date.toDateString() === date?.toDateString())
                .map((event) => (
                  <div key={event.id} className="border p-4 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{event.time}</p>
                        <p className="text-sm text-gray-600">{event.notification}</p>
                      </div>
                    </div>
                    {event.note && (
                      <p className="text-sm text-gray-500 mt-2">{event.note}</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;