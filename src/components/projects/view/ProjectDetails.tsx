import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import ProjectMap from "../ProjectMap";

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails = ({ project }: ProjectDetailsProps) => {
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

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Status</h3>
          <Badge className={getStatusColor(project.status)}>
            {project.status.replace('_', ' ')}
          </Badge>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Description</h3>
          <p className="mt-1">{project.description}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
            <p className="mt-1">{new Date(project.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Deadline</h3>
            <p className="mt-1">{new Date(project.deadline).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Cost</h3>
            <p className="mt-1">${project.cost}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Profit</h3>
            <p className="mt-1">${project.profit}</p>
          </div>
        </div>

        {project.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Notes</h3>
            <p className="mt-1 whitespace-pre-wrap">{project.notes}</p>
          </div>
        )}

        {project.location && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Location</h3>
            <div className="mt-2 h-[300px]">
              <ProjectMap
                initialLocation={project.location}
                onLocationSelect={() => {}}
                readOnly
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProjectDetails;