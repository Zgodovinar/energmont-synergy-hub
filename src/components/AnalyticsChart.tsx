import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { month: "Jan", projects: 4, cost: 45000, profit: 15000 },
  { month: "Feb", projects: 6, cost: 65000, profit: 22000 },
  { month: "Mar", projects: 8, cost: 85000, profit: 30000 },
  { month: "Apr", projects: 5, cost: 55000, profit: 18000 },
  { month: "May", projects: 7, cost: 75000, profit: 25000 },
  { month: "Jun", projects: 9, cost: 95000, profit: 35000 },
];

const AnalyticsChart = () => {
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