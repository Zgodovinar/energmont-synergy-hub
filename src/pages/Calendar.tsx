import Sidebar from "@/components/Sidebar";
import { InlineWidget } from "react-calendly";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const CalendarPage = () => {
  const { session } = useAuth();
  const [calendlyUrl, setCalendlyUrl] = useState("");

  useEffect(() => {
    const getCalendlyUrl = async () => {
      const { data: { calendly_url }, error } = await supabase.functions.invoke('get-calendly-url');
      
      if (error) {
        console.error('Error fetching Calendly URL:', error);
        return;
      }

      if (calendly_url) {
        setCalendlyUrl(calendly_url);
      }
    };

    getCalendlyUrl();
  }, []);

  if (!calendlyUrl) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <h1 className="text-3xl font-bold mb-8">Calendar</h1>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            Loading calendar...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Calendar</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <InlineWidget 
            url={calendlyUrl}
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