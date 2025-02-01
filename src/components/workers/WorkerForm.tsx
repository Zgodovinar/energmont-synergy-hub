import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreateWorkerInput } from "@/types/worker";

interface WorkerFormProps {
  formData: CreateWorkerInput & { password?: string };
  onFormChange: (data: CreateWorkerInput & { password?: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const WorkerForm = ({ formData, onFormChange, onSubmit, onCancel }: WorkerFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
          placeholder="Enter worker name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          value={formData.role}
          onChange={(e) => onFormChange({ ...formData, role: e.target.value })}
          placeholder="Enter worker role"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onFormChange({ ...formData, email: e.target.value })}
          placeholder="Enter worker email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => onFormChange({ ...formData, password: e.target.value })}
          placeholder="Enter password (min. 6 characters)"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => onFormChange({ ...formData, phone: e.target.value })}
          placeholder="Enter worker phone"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => onFormChange({ ...formData, address: e.target.value })}
          placeholder="Enter worker address"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pay">Pay Rate ($/hour)</Label>
        <Input
          id="pay"
          type="number"
          value={formData.pay}
          onChange={(e) => onFormChange({ ...formData, pay: Number(e.target.value) })}
          placeholder="Enter hourly pay rate"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default WorkerForm;