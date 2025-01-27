export interface Project {
  id: number;
  name: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  deadline: string;
  cost: number;
  profit: number;
  notes?: string;
  assignedWorkers: number[];
  images: string[];
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  status: Project['status'];
  deadline: string;
  cost?: string;
  profit?: string;
  notes?: string;
}