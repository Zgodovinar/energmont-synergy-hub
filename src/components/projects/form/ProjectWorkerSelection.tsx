import { Worker } from "@/types/worker";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProjectWorkerSelectionProps {
  workers: Worker[];
  selectedWorkerIds: string[];
  onWorkerToggle: (workerId: string) => void;
}

const ProjectWorkerSelection = ({ 
  workers, 
  selectedWorkerIds, 
  onWorkerToggle 
}: ProjectWorkerSelectionProps) => {
  return (
    <div className="space-y-2">
      <Label>Assigned Workers</Label>
      <div className="grid grid-cols-2 gap-4 mt-2">
        {workers.map((worker) => (
          <div key={worker.id} className="flex items-center space-x-2">
            <Checkbox
              id={`worker-${worker.id}`}
              checked={selectedWorkerIds.includes(worker.id)}
              onCheckedChange={() => onWorkerToggle(worker.id)}
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
  );
};

export default ProjectWorkerSelection;