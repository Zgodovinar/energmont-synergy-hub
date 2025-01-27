import Sidebar from "@/components/Sidebar";
import WorkersList from "@/components/WorkersList";

const Workers = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Workers Management</h1>
        <WorkersList />
      </main>
    </div>
  );
};

export default Workers;