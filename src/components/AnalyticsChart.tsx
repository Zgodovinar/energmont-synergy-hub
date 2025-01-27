import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", projects: 4 },
  { month: "Feb", projects: 6 },
  { month: "Mar", projects: 8 },
  { month: "Apr", projects: 5 },
  { month: "May", projects: 7 },
  { month: "Jun", projects: 9 },
];

const AnalyticsChart = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Projects Overview</h2>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="projects" fill="#FF7A00" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AnalyticsChart;