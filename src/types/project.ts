interface AssignedWorker {
  id: string;
  name: string;
  avatar: string;
}

export type ProjectLocation = {
  lat: number;
  lng: number;
  address?: string;
};

export interface Project {
  id: string;
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
  location?: ProjectLocation;
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
  location?: ProjectLocation;
  assignedWorkerIds?: string[];
}