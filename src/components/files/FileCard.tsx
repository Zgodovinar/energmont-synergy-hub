import { Download, Trash, FolderUp } from "lucide-react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import FileIcon from "./FileIcon";

interface FileCardProps {
  file: {
    id: string;
    name: string;
    file_type: string;
    size: number;
    created_at: string;
    file_url: string;
    is_folder: boolean;
    folder_id: string | null;
  };
  onFolderClick: (folderId: string) => void;
  onDownload: (fileUrl: string) => void;
  onDelete: (fileId: string) => void;
  onDragStart: (e: React.DragEvent, fileId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetFolderId: string) => void;
  onMoveToRoot: (fileId: string) => void;
}

const FileCard = ({ 
  file, 
  onFolderClick, 
  onDownload, 
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onMoveToRoot
}: FileCardProps) => {
  const renderFilePreview = () => {
    if (file.is_folder) {
      return <FileIcon fileType="folder" />;
    }
    
    if (file.file_type?.startsWith('image/')) {
      return (
        <div className="w-full h-24 mb-2">
          <img
            src={file.file_url}
            alt={file.name}
            className="w-full h-full object-cover rounded"
          />
        </div>
      );
    }

    return <FileIcon fileType={file.file_type} />;
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div 
          className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => file.is_folder && onFolderClick(file.id)}
          draggable={!file.is_folder}
          onDragStart={(e) => onDragStart(e, file.id)}
          onDragOver={(e) => file.is_folder && onDragOver(e)}
          onDrop={(e) => file.is_folder && onDrop(e, file.id)}
        >
          <div className="flex flex-col items-center gap-2">
            {renderFilePreview()}
            <h3 className="font-medium text-center">{file.name}</h3>
          </div>
          {!file.is_folder && (
            <div className="mt-2 text-sm text-gray-500 text-center">
              <p>{file.file_type}</p>
              <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <p>{new Date(file.created_at).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {!file.is_folder && (
          <>
            <ContextMenuItem onClick={() => onDownload(file.file_url)}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </ContextMenuItem>
            {file.folder_id && (
              <ContextMenuItem onClick={() => onMoveToRoot(file.id)}>
                <FolderUp className="mr-2 h-4 w-4" />
                Move to Root
              </ContextMenuItem>
            )}
          </>
        )}
        <ContextMenuItem onClick={() => onDelete(file.id)}>
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default FileCard;