import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import ProjectHeader from "./projects/ProjectHeader";
import ProjectCard from "./projects/ProjectCard";
import ProjectView from "./ProjectView";
import { Project, CreateProjectInput } from "@/types/project";
import { useProjects } from "@/hooks/useProjects";
import { ScrollArea } from "@/components/ui/scroll-area";

const ProjectsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { projects, isLoading, createProject, updateProject, deleteProject } = useProjects();
  const { toast } = useToast();

  const handleAddProject = async (data: CreateProjectInput) => {
    try {
      await createProject(data);
      toast({
        title: "Success",
        description: "Project added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add project",
        variant: "destructive",
      });
    }
  };

  const handleEditProject = async (data: CreateProjectInput) => {
    if (!selectedProject) return;
    
    try {
      // Create a clean copy of the data without methods
      const cleanData = JSON.parse(JSON.stringify({
        id: selectedProject.id,
        ...data
      }));
      
      await updateProject(cleanData);
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete project",
          variant: "destructive",
        });
      }
    }
  };

  const handleSelectProject = (project: Project) => {
    // Create a clean copy of the project without methods
    const cleanProject = JSON.parse(JSON.stringify(project));
    setSelectedProject(cleanProject);
  };

  const filteredProjects = projects?.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <p>Loading projects...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <ProjectHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddProject={handleAddProject}
      />
      
      <ScrollArea className="h-[calc(100vh-16rem)] mt-6">
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={handleSelectProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      </ScrollArea>

      {selectedProject && (
        <ProjectView
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onEdit={handleEditProject}
        />
      )}
    </Card>
  );
};

export default ProjectsList;