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
import { EventDetailsDialog } from "@/components/calendar/EventDetailsDialog";

const CalendarPage = () => {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
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
        extendedProps: {
          description: event.description
        }
      }));
    },
  });

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event);
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
        
        <Card className="shadow-lg">
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
                editable={false}
                selectable={false}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                events={events || []}
                eventClick={handleEventClick}
                eventDisplay="block"
                eventContent={(eventInfo) => (
                  <div className="p-1 cursor-pointer hover:opacity-90 transition-opacity">
                    <div className="font-semibold truncate">{eventInfo.event.title}</div>
                    {eventInfo.view.type === "dayGridMonth" && eventInfo.event.extendedProps.description && (
                      <div className="text-xs text-gray-600 truncate">
                        {eventInfo.event.extendedProps.description}
                      </div>
                    )}
                  </div>
                )}
                dayCellContent={(args) => {
                  const dayEvents = events?.filter(event => {
                    const eventDate = new Date(event.start);
                    return eventDate.toDateString() === args.date.toDateString();
                  });
                  
                  return (
                    <div className="relative p-2">
                      {dayEvents && dayEvents.length > 0 && (
                        <div className="absolute top-0 left-0 bg-primary text-white text-xs px-1.5 py-0.5 rounded-br">
                          {dayEvents.length}
                        </div>
                      )}
                      <div className="text-right">{args.dayNumberText}</div>
                    </div>
                  );
                }}
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

        <EventDetailsDialog
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      </main>
    </div>
  );
};

export default CalendarPage;