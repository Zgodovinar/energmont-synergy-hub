import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Worker, CreateWorkerInput } from "@/types/worker";
import { useWorkers } from "@/hooks/useWorkers";
import { supabase } from "@/integrations/supabase/client";
import WorkerFormDialog from "./WorkerFormDialog";
import WorkerCard from "./workers/WorkerCard";
import WorkerDetails from "./workers/WorkerDetails";

const WorkersList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"edit" | "view">("edit");
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const { toast } = useToast();
  const { workers, isLoading, createWorker, updateWorker, deleteWorker, updateWorkerImage } = useWorkers();

  const handleAddWorker = (data: CreateWorkerInput) => {
    createWorker(data, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Worker added successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to add worker",
          variant: "destructive",
        });
      }
    });
  };

  const handleEditWorker = (id: string) => (data: CreateWorkerInput) => {
    updateWorker(
      { ...data, id },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Worker updated successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to update worker",
            variant: "destructive",
          });
        }
      }
    );
  };

  const handleDeleteWorker = (id: string) => {
    if (confirm("Are you sure you want to delete this worker?")) {
      deleteWorker(id, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Worker deleted successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to delete worker",
            variant: "destructive",
          });
        }
      });
    }
  };

  const handleImageUpload = async (workerId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('public')
          .upload(`worker-images/${fileName}`, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('public')
          .getPublicUrl(`worker-images/${fileName}`);

        await updateWorkerImage(workerId, publicUrl);

        toast({
          title: "Success",
          description: "Worker image updated successfully",
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
      }
    }
  };

  const filteredWorkers = workers?.filter((worker) =>
    worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worker.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <p>Loading workers...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Workers</h2>
        
        <div className="flex flex-col gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search workers..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === "edit" ? "view" : "edit")}
              className="whitespace-nowrap"
            >
              {viewMode === "edit" ? "View Mode" : "Edit Mode"}
            </Button>
            {viewMode === "edit" && <WorkerFormDialog onSave={handleAddWorker} />}
          </div>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-16rem)] mt-6">
        <div className="space-y-4">
          {filteredWorkers.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              viewMode={viewMode}
              onEdit={handleEditWorker(worker.id)}
              onDelete={() => handleDeleteWorker(worker.id)}
              onView={() => setSelectedWorker(worker)}
              onImageUpload={(e) => handleImageUpload(worker.id, e)}
            />
          ))}
        </div>
      </ScrollArea>

      {selectedWorker && (
        <WorkerDetails
          worker={selectedWorker}
          onClose={() => setSelectedWorker(null)}
        />
      )}
    </Card>
  );
};

export default WorkersList;