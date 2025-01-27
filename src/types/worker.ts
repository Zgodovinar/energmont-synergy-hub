export interface Worker {
  id: number;
  name: string;
  role: string;
  projects: number;
  email?: string;
  phone?: string;
  status?: 'active' | 'inactive';
}

export interface CreateWorkerInput {
  name: string;
  role: string;
  email?: string;
  phone?: string;
}