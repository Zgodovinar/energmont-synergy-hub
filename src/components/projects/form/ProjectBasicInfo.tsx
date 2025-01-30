import { CreateProjectInput } from "@/types/project";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProjectBasicInfoProps {
  formData: CreateProjectInput;
  onChange: (data: Partial<CreateProjectInput>) => void;
}

const ProjectBasicInfo = ({ formData, onChange }: ProjectBasicInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Enter project name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
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
            onChange={(e) => onChange({ deadline: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={formData.status}
            onChange={(e) => onChange({ status: e.target.value as CreateProjectInput['status'] })}
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
            onChange={(e) => onChange({ cost: e.target.value })}
            placeholder="Enter project cost"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profit">Profit ($)</Label>
          <Input
            id="profit"
            type="number"
            value={formData.profit}
            onChange={(e) => onChange({ profit: e.target.value })}
            placeholder="Enter project profit"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectBasicInfo;