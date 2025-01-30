import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AddEventDialogProps {
  onSubmit: (formData: FormData) => void;
}

export const AddEventDialog = ({ onSubmit }: AddEventDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(new FormData(e.currentTarget));
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <Input type="time" name="time" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input type="text" name="notification" placeholder="Event title" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea name="note" placeholder="Add event details..." />
          </div>
          <Button type="submit">Save Event</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};