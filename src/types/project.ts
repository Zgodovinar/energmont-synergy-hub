interface AssignedWorker {
  id: number;
  name: string;
  avatar: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  startDate: string;
  deadline: string;
  cost: number;
  profit: number;
  notes?: string;
  assignedWorkers: AssignedWorker[];
  images: string[];
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  status: Project['status'];
  startDate: string;
  deadline: string;
  cost?: string;
  profit?: string;
  notes?: string;
  images?: string[];
}