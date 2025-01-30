import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreateEventDialog } from "@/components/calendar/CreateEventDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const CalendarPage = () => {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState<{
    start: Date;
    end: Date;
  }>({
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 1))
  });

  // Fetch calendar events from Supabase
  const { data: events, isLoading } = useQuery({
    queryKey: ["calendar-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*");
      
      if (error) throw error;
      
      return data.map(event => ({
        id: event.id,
        title: event.title,
        start: event.start_time,
        end: event.end_time,
        description: event.description,
        allDay: false,
      }));
    },
  });

  const handleEventClick = (clickInfo: any) => {
    console.log("Event clicked:", clickInfo.event);
    // TODO: Implement event details dialog
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <Button 
            onClick={() => setIsCreateEventOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="h-[800px]">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                initialView="dayGridMonth"
                editable={true}
                selectable={false}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                events={events || []}
                eventClick={handleEventClick}
                eventContent={(eventInfo) => (
                  <div className="p-1">
                    <div className="font-semibold">{eventInfo.event.title}</div>
                    {eventInfo.event.extendedProps.description && (
                      <div className="text-xs text-gray-600">
                        {eventInfo.event.extendedProps.description}
                      </div>
                    )}
                  </div>
                )}
                eventClassNames="rounded-md shadow-sm"
                slotMinTime="06:00:00"
                slotMaxTime="20:00:00"
                allDaySlot={true}
                nowIndicator={true}
                height="100%"
              />
            </div>
          </CardContent>
        </Card>

        <CreateEventDialog
          isOpen={isCreateEventOpen}
          onClose={() => setIsCreateEventOpen(false)}
          startTime={selectedTimes.start}
          endTime={selectedTimes.end}
        />
      </main>
    </div>
  );
};

export default CalendarPage;