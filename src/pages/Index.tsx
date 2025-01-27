import Sidebar from "@/components/Sidebar";
import DashboardMetrics from "@/components/DashboardMetrics";
import WorkersList from "@/components/WorkersList";
import ProjectsList from "@/components/ProjectsList";
import AnalyticsChart from "@/components/AnalyticsChart";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <DashboardMetrics />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <WorkersList />
          <ProjectsList />
        </div>
        
        <div className="mt-8">
          <AnalyticsChart />
        </div>
      </main>
    </div>
  );
};

export default Index;