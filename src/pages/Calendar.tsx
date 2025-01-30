import Sidebar from "@/components/Sidebar";
import { InlineWidget } from "react-calendly";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CalendarPage = () => {
  const { session } = useAuth();
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getCalendlyUrl = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-calendly-url');
        
        if (error) {
          console.error('Error fetching Calendly URL:', error);
          toast({
            title: "Error",
            description: "Failed to load calendar. Please try again later.",
            variant: "destructive"
          });
          return;
        }

        if (data?.calendly_url) {
          setCalendlyUrl(data.calendly_url);
        } else {
          toast({
            title: "Error",
            description: "Calendar URL not found. Please try again later.",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error('Error:', err);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    getCalendlyUrl();
  }, []);

  if (isLoading) {
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

  if (!calendlyUrl) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <h1 className="text-3xl font-bold mb-8">Calendar</h1>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            Failed to load calendar. Please refresh the page to try again.
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