import { Project } from "@/types/project";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
  onDelete: (id: string) => void;
}

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

const ProjectCard = ({ project, onView, onDelete }: ProjectCardProps) => {
  return (
    <div className="flex flex-col p-4 bg-gray-50 rounded-lg space-y-2">
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
              onClick={() => onView(project)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(project.id)}
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
  );
};

export default ProjectCard;