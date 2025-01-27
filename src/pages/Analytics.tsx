import Sidebar from "@/components/Sidebar";
import AnalyticsChart from "@/components/AnalyticsChart";
import DashboardMetrics from "@/components/DashboardMetrics";

const Analytics = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Analytics</h1>
        <DashboardMetrics />
        <div className="mt-8">
          <AnalyticsChart />
        </div>
      </main>
    </div>
  );
};

export default Analytics;