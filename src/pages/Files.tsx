import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FileCard from "@/components/files/FileCard";
import FileHeader from "@/components/files/FileHeader";

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
        title: "Folder created",
        description: "The folder has been successfully created.",
      });
    }
  });

  const moveFileMutation = useMutation({
    mutationFn: async ({ fileId, targetFolderId }: { fileId: string; targetFolderId: string | null }) => {
      const { error } = await supabase
        .from('files')
        .update({ folder_id: targetFolderId })
        .eq('id', fileId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast({
        title: "File moved",
        description: "The file has been successfully moved.",
      });
    }
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', currentFolderId] });
      toast({
        title: "File deleted",
        description: "The file has been successfully deleted.",
      });
    }
  });

  const handleCreateFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      createFolderMutation.mutate(folderName);
    }
  };

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
    toast({
      title: "Download started",
      description: "Your file is being downloaded...",
    });
  };

  const handleDelete = (fileId: string) => {
    deleteFileMutation.mutate(fileId);
  };

  const handleDragStart = (e: React.DragEvent, fileId: string) => {
    e.dataTransfer.setData('fileId', fileId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const fileId = e.dataTransfer.getData('fileId');
    if (fileId && fileId !== targetFolderId) {
      moveFileMutation.mutate({ fileId, targetFolderId });
    }
  };

  const handleMoveToRoot = (fileId: string) => {
    moveFileMutation.mutate({ fileId, targetFolderId: null });
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
          onAddFiles={() => {}}
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