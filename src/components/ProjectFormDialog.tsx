import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Project, CreateProjectInput } from "@/types/project";
import { useWorkers } from "@/hooks/useWorkers";
import { ScrollArea } from "./ui/scroll-area";
import ProjectBasicInfo from "./projects/form/ProjectBasicInfo";
import ProjectWorkerSelection from "./projects/form/ProjectWorkerSelection";
import ProjectImageUpload from "./projects/form/ProjectImageUpload";
import ProjectMap from "./projects/ProjectMap";

interface ProjectFormDialogProps {
  project?: Project;
  onSave: (data: CreateProjectInput) => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ProjectFormDialog = ({ project, onSave, trigger, open, onOpenChange }: ProjectFormDialogProps) => {
  const [formData, setFormData] = useState<CreateProjectInput>({
    name: project?.name || "",
    description: project?.description || "",
    startDate: project?.startDate || "",
    deadline: project?.deadline || "",
    cost: project?.cost?.toString() || "",
    profit: project?.profit?.toString() || "",
    status: project?.status || "pending",
    notes: project?.notes || "",
    location: project?.location,
    assignedWorkerIds: project?.assignedWorkers?.map(w => w.id) || [],
  });
  const [images, setImages] = useState<string[]>(project?.images || []);
  const { toast } = useToast();
  const { workers = [] } = useWorkers();

  const handleFormChange = (updates: Partial<CreateProjectInput>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.deadline) {
      toast({
        title: "Error",
        description: "Name and deadline are required",
        variant: "destructive",
      });
      return;
    }
    onSave({ ...formData, images });
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || <Button>Add Project</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <form onSubmit={handleSubmit} className="space-y-6 pr-4">
            <ProjectBasicInfo formData={formData} onChange={handleFormChange} />
            
            <div className="space-y-2">
              <Label>Project Location</Label>
              <ProjectMap
                onLocationSelect={(location) => handleFormChange({ location })}
                initialLocation={formData.location}
              />
            </div>

            <ProjectWorkerSelection
              workers={workers}
              selectedWorkerIds={formData.assignedWorkerIds || []}
              onWorkerToggle={(workerId) => {
                const currentIds = formData.assignedWorkerIds || [];
                handleFormChange({
                  assignedWorkerIds: currentIds.includes(workerId)
                    ? currentIds.filter(id => id !== workerId)
                    : [...currentIds, workerId]
                });
              }}
            />

            <ProjectImageUpload
              images={images}
              onImageUpload={handleImageUpload}
            />

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleFormChange({ notes: e.target.value })}
                placeholder="Enter project notes"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;