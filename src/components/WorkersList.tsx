import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Edit2, Trash2 } from "lucide-react";
import WorkerFormDialog from "./WorkerFormDialog";
import { Worker, CreateWorkerInput } from "@/types/worker";
import { useToast } from "@/components/ui/use-toast";

const initialWorkers = [
  { id: 1, name: "John Smith", role: "Project Manager", projects: 5, email: "john@example.com", status: "active" as const },
  { id: 2, name: "Anna Johnson", role: "Senior Engineer", projects: 3, email: "anna@example.com", status: "active" as const },
  { id: 3, name: "Mike Wilson", role: "Technician", projects: 4, email: "mike@example.com", status: "active" as const },
  { id: 4, name: "Sarah Brown", role: "Engineer", projects: 2, email: "sarah@example.com", status: "active" as const },
];

const WorkersList = () => {
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleAddWorker = (data: CreateWorkerInput) => {
    const newWorker: Worker = {
      id: workers.length + 1,
      ...data,
      projects: 0,
      status: "active",
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

  const filteredWorkers = workers.filter((worker) =>
    worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worker.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Workers</h2>
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search workers..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <WorkerFormDialog onSave={handleAddWorker} />
        </div>
      </div>
      
      <div className="divide-y">
        {filteredWorkers.map((worker) => (
          <div
            key={worker.id}
            className="flex items-center justify-between py-4"
          >
            <div>
              <h3 className="font-medium">{worker.name}</h3>
              <p className="text-sm text-gray-600">{worker.role}</p>
              {worker.email && (
                <p className="text-sm text-gray-500">{worker.email}</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {worker.projects} active projects
              </div>
              <div className="flex items-center space-x-2">
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WorkersList;