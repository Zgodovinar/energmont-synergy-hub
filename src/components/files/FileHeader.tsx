import { Search, Plus, FolderPlus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FileHeaderProps {
  currentFolderId: string | null;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateFolder: () => void;
  onAddFiles: () => void;
  onBack: () => void;
}

const FileHeader = ({
  currentFolderId,
  searchQuery,
  onSearchChange,
  onCreateFolder,
  onAddFiles,
  onBack,
}: FileHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        {currentFolderId && (
          <Button variant="outline" onClick={onBack}>
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        <Button onClick={onCreateFolder}>
          <FolderPlus className="mr-2 h-4 w-4" /> New Folder
        </Button>
        <Button onClick={onAddFiles}>
          <Plus className="mr-2 h-4 w-4" /> Add Files
        </Button>
      </div>
    </div>
  );
};

export default FileHeader;