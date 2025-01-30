import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AddEventDialog } from "@/components/calendar/AddEventDialog";
import { EventsList } from "@/components/calendar/EventsList";

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
        start_time: `${date?.toISOString().split('T')[0]}T${formData.get("time")}:00`,
        end_time: `${date?.toISOString().split('T')[0]}T${formData.get("time")}:00`,
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
              <AddEventDialog onSubmit={(formData) => addEventMutation.mutate(formData)} />
            </div>

            <EventsList events={events} selectedDate={date} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;