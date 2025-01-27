import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProjectViewProps {
  project: Project;
  onClose: () => void;
}

const ProjectView = ({ project, onClose }: ProjectViewProps) => {
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
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="workers">Workers</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card className="p-6">
              <div className="space-y-4">
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

                <div className="grid grid-cols-3 gap-4">
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
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="workers">
            <Card className="p-6">
              <div className="space-y-4">
                {project.assignedWorkers.length > 0 ? (
                  project.assignedWorkers.map((workerId) => (
                    <div key={workerId} className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg`} />
                        <AvatarFallback>W{workerId}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Worker {workerId}</p>
                        <p className="text-sm text-gray-500">Assigned to project</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No workers assigned to this project</p>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="images">
            <Card className="p-6">
              {project.images && project.images.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {project.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Project image ${index + 1}`}
                      className="rounded-lg object-cover w-full h-48"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No images uploaded for this project</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card className="p-6">
              {project.notes ? (
                <p className="whitespace-pre-wrap">{project.notes}</p>
              ) : (
                <p className="text-gray-500">No notes added for this project</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectView;