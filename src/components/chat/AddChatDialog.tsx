import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChat } from "@/hooks/useChat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AddChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddChatDialog = ({ open, onOpenChange }: AddChatDialogProps) => {
  const [name, setName] = useState("");
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const { createRoom } = useChat();

  const { data: workers = [] } = useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workers')
        .select('id, name, image_url, status')
        .eq('status', 'active');

      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedWorkers.length === 0) return;

    createRoom({
      name: name.trim(),
      participantIds: selectedWorkers
    });

    setName("");
    setSelectedWorkers([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Chat</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Chat Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter chat name"
            />
          </div>

          <div className="space-y-2">
            <Label>Select Participants</Label>
            <ScrollArea className="h-[200px] border rounded-md p-2">
              {workers.map((worker) => (
                <div
                  key={worker.id}
                  className="flex items-center space-x-2 py-2"
                >
                  <Checkbox
                    id={worker.id}
                    checked={selectedWorkers.includes(worker.id)}
                    onCheckedChange={(checked) => {
                      setSelectedWorkers(prev =>
                        checked
                          ? [...prev, worker.id]
                          : prev.filter(id => id !== worker.id)
                      );
                    }}
                  />
                  <Label
                    htmlFor={worker.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <img
                      src={worker.image_url || "/placeholder.svg"}
                      alt={worker.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{worker.name}</span>
                  </Label>
                </div>
              ))}
            </ScrollArea>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || selectedWorkers.length === 0}
            >
              Create Chat
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddChatDialog;