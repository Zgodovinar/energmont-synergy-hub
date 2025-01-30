export interface Worker {
  id: string;
  name: string;
  role: string;
  projects: number;
  email?: string;
  phone?: string;
  address?: string;
  image?: string;
  pay?: number;
  status: 'active' | 'inactive';
}

export interface CreateWorkerInput {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  address?: string;
  pay?: number;
}