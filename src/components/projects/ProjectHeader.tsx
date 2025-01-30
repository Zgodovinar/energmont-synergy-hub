import { Button } from "@/components/ui/button";
import ProjectFormDialog from "../ProjectFormDialog";
import ProjectSearch from "./ProjectSearch";
import { CreateProjectInput } from "@/types/project";

interface ProjectHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddProject: (data: CreateProjectInput) => void;
}

const ProjectHeader = ({ searchQuery, onSearchChange, onAddProject }: ProjectHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Projects</h2>
        <ProjectFormDialog onSave={onAddProject} />
      </div>
      <ProjectSearch value={searchQuery} onChange={onSearchChange} />
    </div>
  );
};

export default ProjectHeader;