import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useAnalytics } from "@/hooks/useAnalytics";

const AnalyticsChart = () => {
  const { data } = useAnalytics();

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