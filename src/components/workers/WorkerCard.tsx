import { Worker, CreateWorkerInput } from "@/types/worker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit2, Trash2, Eye, Upload } from "lucide-react";
import WorkerFormDialog from "../WorkerFormDialog";

interface WorkerCardProps {
  worker: Worker;
  viewMode: "edit" | "view";
  onEdit: (data: CreateWorkerInput) => void;
  onDelete: () => void;
  onView: () => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const WorkerCard = ({
  worker,
  viewMode,
  onEdit,
  onDelete,
  onView,
  onImageUpload,
}: WorkerCardProps) => {
  return (
    <div className="flex flex-col p-4 bg-gray-50 rounded-lg space-y-4">
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
                  onChange={onImageUpload}
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
                  onSave={onEdit}
                  trigger={
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={onView}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;