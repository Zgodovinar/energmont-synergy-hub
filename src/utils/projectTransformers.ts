import { Project } from "@/types/project";

export const transformDatabaseProject = (project: any): Project => {
  return {
    id: project.id,
    name: project.name,
    description: project.description || '',
    status: (project.status || 'pending') as Project['status'],
    startDate: project.start_date,
    deadline: project.deadline,
    cost: Number(project.cost) || 0,
    profit: Number(project.profit) || 0,
    notes: project.notes || '',
    location: project.location ? {
      lat: project.location.lat,
      lng: project.location.lng,
      address: project.location.address
    } : undefined,
    assignedWorkers: project.project_workers?.map((pw: any) => ({
      id: pw.worker.id,
      name: pw.worker.name,
      avatar: pw.worker.image_url || '/placeholder.svg'
    })) || [],
    images: project.project_images?.map((pi: any) => pi.image_url) || []
  };
};