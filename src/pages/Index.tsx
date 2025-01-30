import Sidebar from "@/components/Sidebar";
import DashboardMetrics from "@/components/DashboardMetrics";
import WorkersList from "@/components/WorkersList";
import ProjectsList from "@/components/ProjectsList";
import AnalyticsChart from "@/components/AnalyticsChart";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className={`flex-1 transition-all duration-300 p-8`} style={{ marginLeft: '16rem' }}>
        <div className="flex items-center mb-8">
          <img 
            src="/lovable-uploads/005d9bc9-9de8-4430-b0cc-12d6bc393294.png" 
            alt="Company Logo" 
            className="h-8 mr-4"
          />
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        
        <DashboardMetrics />
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
          <div className="w-full">
            <WorkersList />
          </div>
          <div className="w-full">
            <ProjectsList />
          </div>
        </div>
        
        <div className="mt-8">
          <AnalyticsChart />
        </div>
      </main>
    </div>
  );
};

export default Index;