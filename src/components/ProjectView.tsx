import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectViewProps {
  project: Project;
  onClose: () => void;
}

const ProjectView = ({ project, onClose }: ProjectViewProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

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

  const nextImage = () => {
    if (project.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === project.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const previousImage = () => {
    if (project.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <>
      <Dialog open={true} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl flex justify-between items-center">
              {project.name}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[calc(100vh-12rem)]">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full">
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
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="workers">
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
              </TabsContent>

              <TabsContent value="images">
                <Card className="p-6">
                  {project.images && project.images.length > 0 ? (
                    <div className="space-y-4">
                      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={project.images[currentImageIndex]}
                          alt={`Project image ${currentImageIndex + 1}`}
                          className="object-contain w-full h-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-between p-4">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={previousImage}
                            className="bg-white/80 hover:bg-white"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEnlargedImage(project.images[currentImageIndex])}
                            className="bg-white/80 hover:bg-white"
                          >
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={nextImage}
                            className="bg-white/80 hover:bg-white"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-6 gap-2">
                        {project.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative aspect-square rounded-lg overflow-hidden ${
                              index === currentImageIndex ? 'ring-2 ring-primary' : ''
                            }`}
                          >
                            <img
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              className="object-cover w-full h-full"
                            />
                          </button>
                        ))}
                      </div>
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
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {enlargedImage && (
        <Dialog open={!!enlargedImage} onOpenChange={() => setEnlargedImage(null)}>
          <DialogContent className="max-w-[90vw] max-h-[90vh]">
            <img
              src={enlargedImage}
              alt="Enlarged project image"
              className="w-full h-full object-contain"
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ProjectView;