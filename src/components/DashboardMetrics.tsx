import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Users, FolderKanban, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const MetricCard = ({ 
  icon: Icon, 
  label, 
  value, 
  trend 
}: { 
  icon: any, 
  label: string, 
  value: string | number,
  trend?: string 
}) => (
  <Card className="p-6 shadow-card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        {trend && (
          <p className="text-xs text-green-500 mt-1">{trend}</p>
        )}
      </div>
      <Icon className="w-6 h-6 text-primary" />
    </div>
  </Card>
);

const DashboardMetrics = () => {
  const { data: workersCount = 0 } = useQuery({
    queryKey: ['workers-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('workers')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: projectsData = { active: 0, completed: 0 } } = useQuery({
    queryKey: ['projects-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('status');
      
      if (error) throw error;

      const active = data.filter(p => p.status === 'in_progress').length;
      const completed = data.filter(p => p.status === 'completed').length;
      
      return { active, completed };
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        icon={Users}
        label="Total Workers"
        value={workersCount}
        trend={`${workersCount} active members`}
      />
      <MetricCard
        icon={FolderKanban}
        label="Active Projects"
        value={projectsData.active}
        trend={`${projectsData.completed} completed this month`}
      />
      <MetricCard
        icon={CheckCircle}
        label="Completed Projects"
        value={projectsData.completed}
        trend={`${Math.round((projectsData.completed / (projectsData.active + projectsData.completed || 1)) * 100)}% completion rate`}
      />
    </div>
  );
};

export default DashboardMetrics;