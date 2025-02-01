import Sidebar from "@/components/Sidebar";
import DashboardMetrics from "@/components/DashboardMetrics";
import WorkersList from "@/components/WorkersList";
import ProjectsList from "@/components/ProjectsList";
import AnalyticsChart from "@/components/AnalyticsChart";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 ml-64">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          
          <DashboardMetrics />
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <WorkersList />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <ProjectsList />
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <AnalyticsChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;