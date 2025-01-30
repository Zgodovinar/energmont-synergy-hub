import Sidebar from "@/components/Sidebar";
import { InlineWidget } from "react-calendly";

const CalendarPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Calendar</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <InlineWidget 
            url="https://calendly.com/svaljzgodovina"
            styles={{
              height: '800px'
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;