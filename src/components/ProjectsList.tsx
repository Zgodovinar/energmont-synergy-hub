import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const projects = [
  { 
    id: 1, 
    name: "Solar Installation Project", 
    status: "In Progress",
    deadline: "Mar 15, 2024" 
  },
  { 
    id: 2, 
    name: "Wind Farm Maintenance", 
    status: "Completed",
    deadline: "Mar 10, 2024" 
  },
  { 
    id: 3, 
    name: "Energy Audit", 
    status: "Pending",
    deadline: "Mar 20, 2024" 
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ProjectsList = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Recent Projects</h2>
      
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <h3 className="font-medium">{project.name}</h3>
              <p className="text-sm text-gray-600">Due {project.deadline}</p>
            </div>
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProjectsList;