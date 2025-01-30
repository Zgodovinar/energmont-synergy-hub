import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface MonthlyMetric {
  month: string;
  projects: number;
  cost: number;
  profit: number;
}

export const useAnalytics = () => {
  const [data, setData] = useState<MonthlyMetric[]>([]);

  const calculateMonthlyMetrics = async () => {
    console.log('Calculating monthly metrics...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*');

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      return;
    }

    // Group projects by month
    const monthlyData = projects.reduce<Record<string, MonthlyMetric>>((acc, project) => {
      const month = new Date(project.created_at).toLocaleString('default', { month: 'short' });
      
      if (!acc[month]) {
        acc[month] = {
          month,
          projects: 0,
          cost: 0,
          profit: 0
        };
      }

      acc[month].projects += 1;
      acc[month].cost += Number(project.cost) || 0;
      acc[month].profit += Number(project.profit) || 0;

      return acc;
    }, {});

    // Convert to array and sort by month
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sortedData = Object.values(monthlyData).sort((a, b) => 
      monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
    );

    console.log('Monthly metrics calculated:', sortedData);
    setData(sortedData);

    // Update analytics table
    await updateAnalyticsTable(monthlyData);
  };

  const updateAnalyticsTable = async (monthlyData: Record<string, MonthlyMetric>) => {
    for (const monthData of Object.values(monthlyData)) {
      const { error: upsertError } = await supabase
        .from('analytics')
        .upsert({
          month: monthData.month,
          projects: monthData.projects,
          cost: monthData.cost,
          profit: monthData.profit
        }, {
          onConflict: 'month'
        });

      if (upsertError) {
        console.error('Error upserting analytics:', upsertError);
      }
    }
  };

  useEffect(() => {
    calculateMonthlyMetrics();

    // Set up real-time subscription for projects table
    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        () => {
          console.log('Projects changed, recalculating metrics...');
          calculateMonthlyMetrics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { data };
};