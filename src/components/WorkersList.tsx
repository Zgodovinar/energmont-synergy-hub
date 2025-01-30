import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit2, Trash2, Eye, Upload, X } from "lucide-react";
import WorkerFormDialog from "./WorkerFormDialog";
import { Worker, CreateWorkerInput } from "@/types/worker";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkers } from "@/hooks/useWorkers";
import { supabase } from "@/integrations/supabase/client";

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
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('public')
          .upload(`worker-images/${fileName}`, file);

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('public')
          .getPublicUrl(`worker-images/${fileName}`);

        // Update worker with new image URL
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
            <div
              key={worker.id}
              className="flex flex-col p-4 bg-gray-50 rounded-lg space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={worker.image} alt={worker.name} />
                      <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {viewMode === "edit" && (
                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                        <Upload className="h-4 w-4 text-white" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(worker.id, e)}
                        />
                      </label>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{worker.name}</h3>
                    <p className="text-sm text-gray-600">{worker.role}</p>
                    <p className="text-sm text-gray-500">{worker.email}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-gray-500">{worker.phone}</p>
                      <p className="text-sm text-gray-500">${worker.pay}/hr</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <Badge variant="outline" className="mb-2">
                    {worker.projects} active projects
                  </Badge>
                  
                  <div className="flex items-center space-x-2">
                    {viewMode === "edit" ? (
                      <>
                        <WorkerFormDialog
                          worker={worker}
                          onSave={handleEditWorker(worker.id)}
                          trigger={
                            <Button variant="ghost" size="icon">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteWorker(worker.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedWorker(worker)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {selectedWorker && (
        <Dialog open={true} onOpenChange={() => setSelectedWorker(null)}>
          <DialogContent className="max-w-2xl">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedWorker.image} alt={selectedWorker.name} />
                  <AvatarFallback>{selectedWorker.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-semibold">{selectedWorker.name}</h2>
                  <p className="text-gray-500">{selectedWorker.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p>{selectedWorker.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p>{selectedWorker.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p>{selectedWorker.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Pay Rate</h3>
                  <p>${selectedWorker.pay}/hr</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge variant={selectedWorker.status === 'active' ? 'default' : 'secondary'}>
                    {selectedWorker.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
                  <p>{selectedWorker.projects}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default WorkersList;