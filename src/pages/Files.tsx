import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Search, Plus, Download, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface File {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
}

const Files = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Mock files data
  const files: File[] = [
    { id: "1", name: "Project Report.pdf", type: "PDF", size: "2.5 MB", date: "2024-03-15" },
    { id: "2", name: "Invoice.docx", type: "DOCX", size: "1.2 MB", date: "2024-03-14" },
  ];

  const handleDownload = (fileId: string) => {
    toast({
      title: "Download started",
      description: "Your file is being downloaded...",
    });
  };

  const handleDelete = (fileId: string) => {
    toast({
      title: "File deleted",
      description: "The file has been successfully deleted.",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Files</h1>
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
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Files
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <ContextMenu key={file.id}>
              <ContextMenuTrigger>
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <h3 className="font-medium">{file.name}</h3>
                  <p className="text-sm text-gray-500">
                    {file.type} • {file.size}
                  </p>
                  <p className="text-sm text-gray-400">{file.date}</p>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => handleDownload(file.id)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </ContextMenuItem>
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