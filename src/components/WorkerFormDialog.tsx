import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Worker, CreateWorkerInput } from "@/types/worker";
import { supabase } from "@/integrations/supabase/client";
import WorkerForm from "./workers/WorkerForm";
import { validateWorkerForm } from "@/utils/formValidation";

interface WorkerFormDialogProps {
  worker?: Worker;
  onSave: (data: CreateWorkerInput) => Promise<void>;
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
    
    const validationError = validateWorkerForm(formData);
    if (validationError) {
      toast({
        title: "Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Creating new worker with data:', { ...formData, password: '[REDACTED]' });
      
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password!,
        options: {
          data: {
            full_name: formData.name,
          },
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      console.log('Auth user created successfully:', authData);

      // Then create worker profile
      const workerData = {
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        pay: formData.pay,
      };

      await onSave(workerData);
      
      // Clear form and close dialog
      setFormData({ 
        name: "", 
        role: "", 
        email: "", 
        phone: "", 
        address: "", 
        pay: undefined, 
        password: "" 
      });
      setOpen(false);

      toast({
        title: "Success",
        description: "Worker created successfully",
      });
    } catch (error: any) {
      console.error('Error creating worker:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create worker account",
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
        <WorkerForm
          formData={formData}
          onFormChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WorkerFormDialog;