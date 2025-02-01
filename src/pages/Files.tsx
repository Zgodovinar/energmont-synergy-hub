import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FileCard from "@/components/files/FileCard";
import FileHeader from "@/components/files/FileHeader";
import { Input } from "@/components/ui/input";

interface File {
  id: string;
  name: string;
  file_type: string;
  size: number;
  created_at: string;
  file_url: string;
  is_folder: boolean;
  folder_id: string | null;
}

const Files = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useState<HTMLInputElement | null>(null);

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['files', currentFolderId],
    queryFn: async () => {
      const query = supabase
        .from('files')
        .select('*');
      
      if (currentFolderId === null) {
        query.is('folder_id', null);
      } else {
        query.eq('folder_id', currentFolderId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });

  const uploadFileMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const uploadedFiles = [];
      
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from('public')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('public')
          .getPublicUrl(filePath);

        // Insert file record
        const { data, error: dbError } = await supabase
          .from('files')
          .insert({
            name: file.name,
            file_type: file.type,
            size: file.size,
            file_url: publicUrl,
            folder_id: currentFolderId,
            is_folder: false
          })
          .select()
          .single();

        if (dbError) throw dbError;
        uploadedFiles.push(data);
      }
      
      return uploadedFiles;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', currentFolderId] });
      toast({
        title: "Success",
        description: "Files uploaded successfully"
      });
    },
    onError: (error) => {
      console.error('Error uploading files:', error);
      toast({
        title: "Error",
        description: "Failed to upload files",
        variant: "destructive"
      });
    }
  });

  const createFolderMutation = useMutation({
    mutationFn: async (folderName: string) => {
      const { data, error } = await supabase
        .from('files')
        .insert({
          name: folderName,
          is_folder: true,
          folder_id: currentFolderId,
          file_url: '',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', currentFolderId] });
      toast({
        title: "Success",
        description: "Folder created successfully"
      });
    },
    onError: (error) => {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive"
      });
    }
  });

  const handleCreateFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      createFolderMutation.mutate(folderName);
    }
  };

  const handleAddFiles = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        uploadFileMutation.mutate(files);
      }
    };
    input.click();
  };

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
    toast({
      title: "Download started",
      description: "Your file is being downloaded..."
    });
  };

  const handleDelete = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['files', currentFolderId] });
      toast({
        title: "Success",
        description: "File deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive"
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, fileId: string) => {
    e.dataTransfer.setData('fileId', fileId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const fileId = e.dataTransfer.getData('fileId');
    if (fileId && fileId !== targetFolderId) {
      try {
        const { error } = await supabase
          .from('files')
          .update({ folder_id: targetFolderId })
          .eq('id', fileId);

        if (error) throw error;

        queryClient.invalidateQueries({ queryKey: ['files'] });
        toast({
          title: "Success",
          description: "File moved successfully"
        });
      } catch (error) {
        console.error('Error moving file:', error);
        toast({
          title: "Error",
          description: "Failed to move file",
          variant: "destructive"
        });
      }
    }
  };

  const handleMoveToRoot = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('files')
        .update({ folder_id: null })
        .eq('id', fileId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast({
        title: "Success",
        description: "File moved to root successfully"
      });
    } catch (error) {
      console.error('Error moving file to root:', error);
      toast({
        title: "Error",
        description: "Failed to move file to root",
        variant: "destructive"
      });
    }
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <FileHeader
          currentFolderId={currentFolderId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateFolder={handleCreateFolder}
          onAddFiles={handleAddFiles}
          onBack={() => setCurrentFolderId(null)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onFolderClick={(folderId) => setCurrentFolderId(folderId)}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onMoveToRoot={handleMoveToRoot}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Files;