interface Event {
  id: string;
  title: string;
  description?: string;
  start_time: string;
}

interface EventsListProps {
  events: Event[];
  selectedDate?: Date;
}

export const EventsList = ({ events, selectedDate }: EventsListProps) => {
  const filteredEvents = events.filter(
    (event) => new Date(event.start_time).toDateString() === selectedDate?.toDateString()
  );

  return (
    <div className="space-y-4">
      {filteredEvents.map((event) => (
        <div key={event.id} className="border p-4 rounded-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">
                {new Date(event.start_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm text-gray-600">{event.title}</p>
            </div>
          </div>
          {event.description && (
            <p className="text-sm text-gray-500 mt-2">{event.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};