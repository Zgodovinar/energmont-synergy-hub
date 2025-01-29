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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const initialProjects = [
  { 
    id: 1, 
    name: "Solar Installation Project", 
    description: "Installation of solar panels for residential complex",
    status: "in_progress" as const,
    startDate: "2024-02-15",
    deadline: "2024-03-15",
    cost: 25000,
    profit: 8000,
    notes: "Need to order additional panels",
    assignedWorkers: [
      { id: 1, name: "John Smith", avatar: "/placeholder.svg" },
      { id: 2, name: "Anna Johnson", avatar: "/placeholder.svg" }
    ],
    images: []
  },
  { 
    id: 2, 
    name: "Wind Farm Maintenance", 
    description: "Regular maintenance of wind turbines",
    status: "completed" as const,
    startDate: "2024-02-10",
    deadline: "2024-03-10",
    cost: 15000,
    profit: 5000,
    notes: "All turbines functioning properly",
    assignedWorkers: [
      { id: 1, name: "John Smith", avatar: "/placeholder.svg" }
    ],
    images: []
  },
  { 
    id: 3, 
    name: "Energy Audit", 
    description: "Comprehensive energy audit for commercial building",
    status: "pending" as const,
    startDate: "2024-02-20",
    deadline: "2024-03-20",
    cost: 5000,
    profit: 2000,
    notes: "Initial assessment scheduled",
    assignedWorkers: [
      { id: 2, name: "Anna Johnson", avatar: "/placeholder.svg" }
    ],
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
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Projects</h2>
          <ProjectFormDialog onSave={handleAddProject} />
        </div>
        
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-4 mt-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col p-4 bg-gray-50 rounded-lg space-y-2"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-gray-600">{project.description}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
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
            
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600">Due {new Date(project.deadline).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Cost: ${project.cost}</p>
                <p className="text-sm text-gray-600">Profit: ${project.profit}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600 mr-2">Team:</p>
                {project.assignedWorkers.map((worker) => (
                  <Avatar key={worker.id} className="h-8 w-8">
                    <AvatarImage src={worker.avatar} alt={worker.name} />
                    <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
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
