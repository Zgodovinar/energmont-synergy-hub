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
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const initialWorkers = [
  { 
    id: 1, 
    name: "John Smith", 
    role: "Project Manager", 
    projects: 5, 
    email: "john@example.com", 
    phone: "+1234567890",
    address: "123 Main St",
    status: "active" as const,
    pay: 25,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  { 
    id: 2, 
    name: "Anna Johnson", 
    role: "Senior Engineer", 
    projects: 3, 
    email: "anna@example.com",
    phone: "+1234567891",
    address: "456 Oak St",
    status: "active" as const,
    pay: 30,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
];

const WorkersList = () => {
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"edit" | "view">("edit");
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const { toast } = useToast();

  const handleAddWorker = (data: CreateWorkerInput) => {
    const newWorker: Worker = {
      id: workers.length + 1,
      ...data,
      projects: 0,
      status: "active",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    };
    setWorkers([...workers, newWorker]);
    toast({
      title: "Success",
      description: "Worker added successfully",
    });
  };

  const handleEditWorker = (id: number) => (data: CreateWorkerInput) => {
    setWorkers(
      workers.map((worker) =>
        worker.id === id
          ? { ...worker, ...data }
          : worker
      )
    );
    toast({
      title: "Success",
      description: "Worker updated successfully",
    });
  };

  const handleDeleteWorker = (id: number) => {
    if (confirm("Are you sure you want to delete this worker?")) {
      setWorkers(workers.filter((worker) => worker.id !== id));
      toast({
        title: "Success",
        description: "Worker deleted successfully",
      });
    }
  };

  const handleImageUpload = (workerId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWorkers(workers.map(worker => 
          worker.id === workerId 
            ? { ...worker, image: reader.result as string }
            : worker
        ));
        toast({
          title: "Success",
          description: "Worker image updated successfully",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredWorkers = workers.filter((worker) =>
    worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worker.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold">Workers</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search workers..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
      
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-4">
          {filteredWorkers.map((worker) => (
            <div
              key={worker.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
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
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {worker.projects} active projects
                </Badge>
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