import { Project } from "@/types/project";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProjectWorkersProps {
  project: Project;
}

const ProjectWorkers = ({ project }: ProjectWorkersProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        {project.assignedWorkers.length > 0 ? (
          project.assignedWorkers.map((worker) => (
            <div key={worker.id} className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={worker.avatar} alt={worker.name} />
                <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{worker.name}</p>
                <p className="text-sm text-gray-500">Assigned to project</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No workers assigned to this project</p>
        )}
      </div>
    </Card>
  );
};

export default ProjectWorkers;