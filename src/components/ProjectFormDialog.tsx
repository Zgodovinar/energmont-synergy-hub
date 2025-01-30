import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Project, CreateProjectInput } from "@/types/project";
import { Upload } from "lucide-react";
import { useWorkers } from "@/hooks/useWorkers";
import ProjectMap from "./projects/ProjectMap";
import { ScrollArea } from "./ui/scroll-area";
import { Checkbox } from "./ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ProjectFormDialogProps {
  project?: Project;
  onSave: (data: CreateProjectInput) => void;
  trigger?: React.ReactNode;
}

const ProjectFormDialog = ({ project, onSave, trigger }: ProjectFormDialogProps) => {
  const [open, setOpen] = useState(false);
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
    setOpen(false);
    setFormData({ 
      name: "", 
      description: "", 
      startDate: "",
      deadline: "", 
      cost: "", 
      profit: "", 
      status: "pending",
      notes: "",
      assignedWorkerIds: [],
    });
    setImages([]);
  };

  const toggleWorker = (workerId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedWorkerIds: prev.assignedWorkerIds?.includes(workerId)
        ? prev.assignedWorkerIds.filter(id => id !== workerId)
        : [...(prev.assignedWorkerIds || []), workerId]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Add Project</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <form onSubmit={handleSubmit} className="space-y-6 pr-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter project description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  placeholder="Enter project cost"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profit">Profit ($)</Label>
                <Input
                  id="profit"
                  type="number"
                  value={formData.profit}
                  onChange={(e) => setFormData({ ...formData, profit: e.target.value })}
                  placeholder="Enter project profit"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Project Location</Label>
              <ProjectMap
                onLocationSelect={(location) => setFormData({ ...formData, location })}
                initialLocation={formData.location}
              />
            </div>

            <div className="space-y-2">
              <Label>Assigned Workers</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {workers.map((worker) => (
                  <div key={worker.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`worker-${worker.id}`}
                      checked={formData.assignedWorkerIds?.includes(worker.id)}
                      onCheckedChange={() => toggleWorker(worker.id)}
                    />
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={worker.image} />
                        <AvatarFallback>{worker.name[0]}</AvatarFallback>
                      </Avatar>
                      <Label htmlFor={`worker-${worker.id}`}>{worker.name}</Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Project Images</Label>
              <div className="flex flex-wrap gap-4">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Project image ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ))}
                <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Enter project notes"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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