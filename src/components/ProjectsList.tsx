import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit2, Trash2, Eye } from "lucide-react";
import ProjectFormDialog from "./ProjectFormDialog";
import ProjectView from "./ProjectView";
import { Project, CreateProjectInput } from "@/types/project";
import { useToast } from "@/components/ui/use-toast";

const initialProjects = [
  { 
    id: 1, 
    name: "Solar Installation Project", 
    description: "Installation of solar panels for residential complex",
    status: "in_progress" as const,
    startDate: "2024-02-15", // Added startDate
    deadline: "2024-03-15",
    cost: 25000,
    profit: 8000,
    notes: "Need to order additional panels",
    assignedWorkers: [1, 2],
    images: []
  },
  { 
    id: 2, 
    name: "Wind Farm Maintenance", 
    description: "Regular maintenance of wind turbines",
    status: "completed" as const,
    startDate: "2024-02-10", // Added startDate
    deadline: "2024-03-10",
    cost: 15000,
    profit: 5000,
    notes: "All turbines functioning properly",
    assignedWorkers: [3],
    images: []
  },
  { 
    id: 3, 
    name: "Energy Audit", 
    description: "Comprehensive energy audit for commercial building",
    status: "pending" as const,
    startDate: "2024-02-20", // Added startDate
    deadline: "2024-03-20",
    cost: 5000,
    profit: 2000,
    notes: "Initial assessment scheduled",
    assignedWorkers: [4],
    images: []
  },
];

const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ProjectsList = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const handleAddProject = (data: CreateProjectInput) => {
    const newProject: Project = {
      id: projects.length + 1,
      ...data,
      cost: Number(data.cost) || 0,
      profit: Number(data.profit) || 0,
      assignedWorkers: [],
      images: [],
    };
    setProjects([...projects, newProject]);
    toast({
      title: "Success",
      description: "Project added successfully",
    });
  };

  const handleEditProject = (id: number) => (data: CreateProjectInput) => {
    setProjects(
      projects.map((project) =>
        project.id === id
          ? { 
              ...project, 
              ...data,
              cost: Number(data.cost) || 0,
              profit: Number(data.profit) || 0,
            }
          : project
      )
    );
    toast({
      title: "Success",
      description: "Project updated successfully",
    });
  };

  const handleDeleteProject = (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter((project) => project.id !== id));
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Projects</h2>
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <ProjectFormDialog onSave={handleAddProject} />
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <h3 className="font-medium">{project.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{project.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-sm text-gray-600">Due {new Date(project.deadline).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Cost: ${project.cost}</p>
                <p className="text-sm text-gray-600">Profit: ${project.profit}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={getStatusColor(project.status)}>
                {project.status.replace('_', ' ')}
              </Badge>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedProject(project)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <ProjectFormDialog
                  project={project}
                  onSave={handleEditProject(project.id)}
                  trigger={
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <ProjectView
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </Card>
  );
};

export default ProjectsList;