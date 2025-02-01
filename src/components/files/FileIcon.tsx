import { FileText, Image, FileSpreadsheet, FileCode, File, Folder } from "lucide-react";

interface FileIconProps {
  fileType: string | null;
  className?: string;
}

const FileIcon = ({ fileType, className = "h-8 w-8" }: FileIconProps) => {
  // Handle folder type first
  if (fileType === 'folder') {
    return <Folder className={`${className} text-blue-500`} />;
  }

  // Helper function to get MIME type category
  const getFileCategory = (type: string | null) => {
    if (!type) return 'unknown';
    if (type.startsWith('image/')) return 'image';
    if (type.includes('spreadsheet') || type.includes('excel')) return 'spreadsheet';
    if (type.includes('document') || type.includes('word')) return 'document';
    if (type.includes('pdf')) return 'pdf';
    if (type.includes('text/')) return 'text';
    return 'unknown';
  };

  const category = getFileCategory(fileType);

  switch (category) {
    case 'image':
      return <Image className={`${className} text-blue-500`} />;
    case 'spreadsheet':
      return <FileSpreadsheet className={`${className} text-green-500`} />;
    case 'document':
      return <FileText className={`${className} text-yellow-500`} />;
    case 'text':
      return <FileCode className={`${className} text-purple-500`} />;
    default:
      return <File className={`${className} text-gray-500`} />;
  }
};

export default FileIcon;