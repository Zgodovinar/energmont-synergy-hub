import Sidebar from "@/components/Sidebar";
import ProjectsList from "@/components/ProjectsList";

const Projects = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Projects Management</h1>
        <ProjectsList />
      </main>
    </div>
  );
};

export default Projects;