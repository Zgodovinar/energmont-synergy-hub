import { Worker } from "@/types/worker";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface WorkerDetailsProps {
  worker: Worker;
  onClose: () => void;
}

const WorkerDetails = ({ worker, onClose }: WorkerDetailsProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={worker.image} alt={worker.name} />
              <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{worker.name}</h2>
              <p className="text-gray-500">{worker.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p>{worker.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p>{worker.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p>{worker.address}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pay Rate</h3>
              <p>${worker.pay}/hr</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <Badge variant={worker.status === 'active' ? 'default' : 'secondary'}>
                {worker.status}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
              <p>{worker.projects}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkerDetails;