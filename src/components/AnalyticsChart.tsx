import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { supabase } from "@/integrations/supabase/client";

const AnalyticsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data: analyticsData, error } = await supabase
        .from('analytics')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching analytics:', error);
        return;
      }

      setData(analyticsData);
    };

    fetchAnalytics();

    // Set up real-time subscription
    const channel = supabase
      .channel('analytics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'analytics'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Projects Overview</h2>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="projects" fill="#FF7A00" name="Projects" />
            <Bar yAxisId="right" dataKey="cost" fill="#FF0000" name="Cost ($)" />
            <Bar yAxisId="right" dataKey="profit" fill="#00CC66" name="Profit ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AnalyticsChart;