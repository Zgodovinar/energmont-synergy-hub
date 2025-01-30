import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  startTime: Date;
  endTime: Date;
}

export function CreateEventDialog({ isOpen, onClose, startTime, endTime }: CreateEventDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .insert([
          {
            title,
            description,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Event created",
        description: "Your event has been successfully created.",
      });

      onClose();
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Event description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="datetime-local"
                  value={format(startTime, "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    startTime.setFullYear(newDate.getFullYear());
                    startTime.setMonth(newDate.getMonth());
                    startTime.setDate(newDate.getDate());
                    startTime.setHours(newDate.getHours());
                    startTime.setMinutes(newDate.getMinutes());
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="datetime-local"
                  value={format(endTime, "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    endTime.setFullYear(newDate.getFullYear());
                    endTime.setMonth(newDate.getMonth());
                    endTime.setDate(newDate.getDate());
                    endTime.setHours(newDate.getHours());
                    endTime.setMinutes(newDate.getMinutes());
                  }}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}