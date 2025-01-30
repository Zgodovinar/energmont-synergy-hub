import { Button } from "@/components/ui/button";
import { Paperclip, X, FolderUp, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FilePreviewProps {
  file: File;
  fileId?: string;
  onClear: () => void;
  isAdmin?: boolean;
}

const FilePreview = ({ file, fileId, onClear, isAdmin }: FilePreviewProps) => {
  const { toast } = useToast();

  const moveToFiles = async () => {
    if (!fileId) return;
    try {
      const { error } = await supabase
        .from('files')
        .update({ saved_to_files: true })
        .eq('id', fileId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "File saved to Files page",
      });
    } catch (error) {
      console.error('Error saving file:', error);
      toast({
        title: "Error",
        description: "Failed to save file",
        variant: "destructive"
      });
    }
  };

  const deleteFile = async () => {
    if (!fileId) return;
    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "File deleted successfully",
      });
      onClear();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="mb-2 p-2 bg-secondary rounded flex items-center gap-2">
      <Paperclip className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm">{file.name}</span>
      <div className="ml-auto flex items-center gap-2">
        {isAdmin && fileId && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={moveToFiles}
              className="h-6 w-6"
            >
              <FolderUp className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={deleteFile}
              className="h-6 w-6 text-destructive"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClear}
          className="h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FilePreview;