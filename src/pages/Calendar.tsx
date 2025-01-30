import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const CalendarPage = () => {
  const [currentEvents, setCurrentEvents] = useState([]);

  // Fetch calendar events from Supabase
  const { data: events, isLoading } = useQuery({
    queryKey: ["calendar-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*");
      
      if (error) throw error;
      
      // Transform the data to match FullCalendar's event format
      return data.map(event => ({
        id: event.id,
        title: event.title,
        start: event.start_time,
        end: event.end_time,
        description: event.description,
        location: event.location,
      }));
    },
  });

  const handleDateSelect = (selectInfo: any) => {
    console.log("Date selected:", selectInfo);
    // TODO: Implement event creation dialog
  };

  const handleEventClick = (clickInfo: any) => {
    console.log("Event clicked:", clickInfo.event);
    // TODO: Implement event details dialog
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Calendar</h1>
        
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
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                events={events || []}
                select={handleDateSelect}
                eventClick={handleEventClick}
                eventContent={(eventInfo) => (
                  <div className="p-1">
                    <div className="font-semibold">{eventInfo.event.title}</div>
                    {eventInfo.event.extendedProps.description && (
                      <div className="text-xs text-gray-600">
                        {eventInfo.event.extendedProps.description}
                      </div>
                    )}
                    {eventInfo.event.extendedProps.location && (
                      <div className="text-xs text-gray-500">
                        📍 {eventInfo.event.extendedProps.location}
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
      </main>
    </div>
  );
};

export default CalendarPage;