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
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Event {
  id: string;
  date: Date;
  time: string;
  notification: string;
  note: string;
}

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch events for the current user
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['calendar_events', session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('created_by', session?.user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user.id
  });

  const addEventMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const eventData = {
        title: formData.get("notification") as string,
        description: formData.get("note") as string,
        start_time: new Date(`${date?.toISOString().split('T')[0]}T${formData.get("time")}:00`),
        end_time: new Date(`${date?.toISOString().split('T')[0]}T${formData.get("time")}:00`),
        created_by: session?.user.id
      };

      const { data, error } = await supabase
        .from('calendar_events')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar_events'] });
      toast({
        title: "Event added",
        description: "Your event has been successfully added to the calendar.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add event. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleAddEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    addEventMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div>Loading...</div>
        </main>
      </div>
    );
  }

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
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <Input type="text" name="notification" placeholder="Event title" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea name="note" placeholder="Add event details..." />
                    </div>
                    <Button type="submit">Save Event</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {events
                .filter((event) => new Date(event.start_time).toDateString() === date?.toDateString())
                .map((event) => (
                  <div key={event.id} className="border p-4 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-sm text-gray-600">{event.title}</p>
                      </div>
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-500 mt-2">{event.description}</p>
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