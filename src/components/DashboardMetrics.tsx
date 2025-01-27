import { Card } from "@/components/ui/card";
import { Users, FolderKanban, CheckCircle } from "lucide-react";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        icon={Users}
        label="Total Workers"
        value="48"
        trend="+12% this month"
      />
      <MetricCard
        icon={FolderKanban}
        label="Active Projects"
        value="23"
        trend="+5 new this week"
      />
      <MetricCard
        icon={CheckCircle}
        label="Completed Tasks"
        value="156"
        trend="89% completion rate"
      />
    </div>
  );
};

export default DashboardMetrics;