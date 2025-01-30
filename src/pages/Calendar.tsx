import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDays, format, setHours, setMinutes } from "date-fns";

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>();

  // Generate available time slots for the selected date
  const getTimeSlots = () => {
    if (!date) return [];
    
    const slots = [];
    let currentTime = setHours(setMinutes(date, 0), 9); // Start at 9 AM
    const endTime = setHours(setMinutes(date, 0), 17); // End at 5 PM

    while (currentTime <= endTime) {
      slots.push(format(currentTime, "h:mm a"));
      currentTime = addDays(currentTime, 0);
      currentTime.setMinutes(currentTime.getMinutes() + 30); // 30-minute slots
    }

    return slots;
  };

  const handleSchedule = () => {
    if (!date || !selectedTime) return;
    
    console.log("Scheduled meeting for:", format(date, "PPP"), "at", selectedTime);
    // Here you would typically make an API call to save the appointment
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Schedule a Meeting</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Select a Date</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today || date.getDay() === 0 || date.getDay() === 6;
              }}
            />
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Select a Time</h2>
            {date ? (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Available times for {format(date, "PPPP")}:
                </p>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {getTimeSlots().map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  className="w-full mt-4" 
                  disabled={!selectedTime}
                  onClick={handleSchedule}
                >
                  Schedule Meeting
                </Button>
              </div>
            ) : (
              <p className="text-gray-500">Please select a date first</p>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;