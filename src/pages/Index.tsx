import DashboardMetrics from "@/components/DashboardMetrics";
import WorkersList from "@/components/WorkersList";
import ProjectsList from "@/components/ProjectsList";
import AnalyticsChart from "@/components/AnalyticsChart";

const Index = () => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
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
    </>
  );
};

export default Index;