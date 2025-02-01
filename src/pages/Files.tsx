import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Search, Plus, Download, Trash, FolderPlus, ArrowLeft, Folder } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
      
      // Use .is() for null checks instead of .eq()
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
          file_url: '', // Required field but not used for folders
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

  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId);
  };

  const handleBackClick = () => {
    setCurrentFolderId(null);
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {currentFolderId && (
              <Button variant="outline" onClick={handleBackClick}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
            <h1 className="text-3xl font-bold">Files</h1>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button onClick={handleCreateFolder}>
              <FolderPlus className="mr-2 h-4 w-4" /> New Folder
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Files
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => (
            <ContextMenu key={file.id}>
              <ContextMenuTrigger>
                <div 
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => file.is_folder && handleFolderClick(file.id)}
                >
                  <div className="flex items-center gap-2">
                    {file.is_folder ? (
                      <Folder className="h-5 w-5 text-blue-500" />
                    ) : null}
                    <h3 className="font-medium">{file.name}</h3>
                  </div>
                  {!file.is_folder && (
                    <>
                      <p className="text-sm text-gray-500">
                        {file.file_type} • {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(file.created_at).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                {!file.is_folder && (
                  <ContextMenuItem onClick={() => handleDownload(file.file_url)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </ContextMenuItem>
                )}
                <ContextMenuItem onClick={() => handleDelete(file.id)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Files;