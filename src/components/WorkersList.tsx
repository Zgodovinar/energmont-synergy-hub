import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const workers = [
  { id: 1, name: "John Smith", role: "Project Manager", projects: 5 },
  { id: 2, name: "Anna Johnson", role: "Senior Engineer", projects: 3 },
  { id: 3, name: "Mike Wilson", role: "Technician", projects: 4 },
  { id: 4, name: "Sarah Brown", role: "Engineer", projects: 2 },
];

const WorkersList = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Workers</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search workers..."
            className="pl-9"
          />
        </div>
      </div>
      
      <div className="divide-y">
        {workers.map((worker) => (
          <div
            key={worker.id}
            className="flex items-center justify-between py-4"
          >
            <div>
              <h3 className="font-medium">{worker.name}</h3>
              <p className="text-sm text-gray-600">{worker.role}</p>
            </div>
            <div className="text-sm text-gray-600">
              {worker.projects} active projects
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WorkersList;