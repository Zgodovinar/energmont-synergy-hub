import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Project } from "@/types/project";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X, Edit } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProjectDetails from "./projects/view/ProjectDetails";
import ProjectWorkers from "./projects/view/ProjectWorkers";
import ProjectImages from "./projects/view/ProjectImages";
import ProjectFormDialog from "./ProjectFormDialog";
import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { useToast } from "./ui/use-toast";

interface ProjectViewProps {
  project: Project;
  onClose: () => void;
}

const ProjectView = ({ project, onClose }: ProjectViewProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { updateProject } = useProjects();
  const { toast } = useToast();

  const handleEdit = async (data: any) => {
    try {
      await updateProject({ id: project.id, ...data });
      setShowEditDialog(false);
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

  return (
    <>
      <Dialog open={true} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl flex justify-between items-center">
              <div className="flex items-center gap-4">
                {project.name}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowEditDialog(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
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
              </TabsList>

              <TabsContent value="details">
                <ProjectDetails project={project} />
              </TabsContent>

              <TabsContent value="workers">
                <ProjectWorkers project={project} />
              </TabsContent>

              <TabsContent value="images">
                <ProjectImages project={project} />
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {showEditDialog && (
        <ProjectFormDialog
          project={project}
          onSave={handleEdit}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          trigger={<div />}
        />
      )}
    </>
  );
};

export default ProjectView;