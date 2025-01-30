import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Worker, CreateWorkerInput } from "@/types/worker";
import { supabase } from "@/integrations/supabase/client";

interface WorkerFormDialogProps {
  worker?: Worker;
  onSave: (data: CreateWorkerInput) => void;
  trigger?: React.ReactNode;
}

const WorkerFormDialog = ({ worker, onSave, trigger }: WorkerFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateWorkerInput & { password?: string }>({
    name: worker?.name || "",
    role: worker?.role || "",
    email: worker?.email || "",
    phone: worker?.phone || "",
    address: worker?.address || "",
    pay: worker?.pay || undefined,
    password: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Name, role, email, and password are required",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
        },
      });

      if (authError) throw authError;

      // Then create worker profile
      const workerData = {
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        pay: formData.pay,
      };

      onSave(workerData);
      setOpen(false);
      setFormData({ 
        name: "", 
        role: "", 
        email: "", 
        phone: "", 
        address: "", 
        pay: undefined, 
        password: "" 
      });
    } catch (error) {
      console.error('Error creating worker:', error);
      toast({
        title: "Error",
        description: "Failed to create worker account",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Add Worker</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{worker ? "Edit Worker" : "Add New Worker"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter worker name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="Enter worker role"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter worker email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter worker password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter worker phone"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter worker address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pay">Pay Rate ($/hour)</Label>
            <Input
              id="pay"
              type="number"
              value={formData.pay}
              onChange={(e) => setFormData({ ...formData, pay: Number(e.target.value) })}
              placeholder="Enter hourly pay rate"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkerFormDialog;