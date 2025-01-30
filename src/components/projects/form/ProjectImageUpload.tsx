import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface ProjectImageUploadProps {
  images: string[];
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProjectImageUpload = ({ images, onImageUpload }: ProjectImageUploadProps) => {
  return (
    <div className="space-y-2">
      <Label>Project Images</Label>
      <div className="flex flex-wrap gap-4">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Project image ${index + 1}`}
            className="w-24 h-24 object-cover rounded-lg"
          />
        ))}
        <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
          <Upload className="h-6 w-6 text-gray-400" />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={onImageUpload}
          />
        </label>
      </div>
    </div>
  );
};

export default ProjectImageUpload;