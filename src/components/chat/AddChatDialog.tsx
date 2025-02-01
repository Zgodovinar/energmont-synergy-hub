import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface AddChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoomSelect: (roomId: string) => void;
}

const AddChatDialog = ({ open, onOpenChange, onRoomSelect }: AddChatDialogProps) => {
  const [name, setName] = useState("");
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const { toast } = useToast();
  const { session } = useAuth();

  const { data: workers = [] } = useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workers')
        .select('id, name, image_url, status, email')
        .eq('status', 'active');

      if (error) throw error;

      // Filter out the current user
      const currentUserEmail = session?.user?.email;
      return data.filter(worker => worker.email !== currentUserEmail);
    },
    enabled: !!session
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedWorkers.length === 0) return;

    try {
      // Get current user's worker record
      const currentUser = await supabase.auth.getUser();
      if (!currentUser.data.user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a chat",
          variant: "destructive"
        });
        return;
      }

      // Create the chat room
      const { data: room, error: roomError } = await supabase
        .from('chat_rooms')
        .insert({
          name: name.trim(),
          type: 'group'
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Get or create admin worker record
      const { data: adminWorker } = await supabase
        .from('workers')
        .select()
        .eq('email', currentUser.data.user.email)
        .single();

      // Add participants including the creator
      const participants = [
        { room_id: room.id, worker_id: adminWorker.id },
        ...selectedWorkers.map(workerId => ({
          room_id: room.id,
          worker_id: workerId
        }))
      ];

      const { error: participantsError } = await supabase
        .from('chat_room_participants')
        .insert(participants);

      if (participantsError) {
        // Clean up the created room if adding participants fails
        await supabase.from('chat_rooms').delete().eq('id', room.id);
        throw participantsError;
      }

      toast({
        title: "Success",
        description: "Group chat created successfully"
      });

      setName("");
      setSelectedWorkers([]);
      onOpenChange(false);
      onRoomSelect(room.id);
    } catch (error) {
      console.error('Error creating group chat:', error);
      toast({
        title: "Error",
        description: "Failed to create group chat",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Group Chat</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
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