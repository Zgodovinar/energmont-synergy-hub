import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Project, CreateProjectInput } from "@/types/project";

export const useProjects = () => {
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      console.log('Fetching projects...');
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_workers (
            worker:workers (
              id,
              name,
              image_url
            )
          ),
          project_images (
            id,
            image_url
          )
        `);
      
      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }

      console.log('Projects fetched:', data);
      
      return data.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description || '',
        status: (project.status || 'pending') as Project['status'], // Explicitly type cast to union type
        startDate: project.start_date,
        deadline: project.deadline,
        cost: Number(project.cost) || 0,
        profit: Number(project.profit) || 0,
        notes: project.notes || '',
        assignedWorkers: project.project_workers?.map(pw => ({
          id: pw.worker.id,
          name: pw.worker.name,
          avatar: pw.worker.image_url || '/placeholder.svg'
        })) || [],
        images: project.project_images?.map(pi => pi.image_url) || []
      }));
    }
  });

  const createProjectMutation = useMutation({
    mutationFn: async (newProject: CreateProjectInput) => {
      console.log('Creating project:', newProject);
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: newProject.name,
          description: newProject.description,
          status: newProject.status,
          start_date: newProject.startDate,
          deadline: newProject.deadline,
          cost: Number(newProject.cost) || 0,
          profit: Number(newProject.profit) || 0,
          notes: newProject.notes
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }

      console.log('Project created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, ...updates }: CreateProjectInput & { id: string }) => {
      console.log('Updating project:', id, updates);
      const { error } = await supabase
        .from('projects')
        .update({
          name: updates.name,
          description: updates.description,
          status: updates.status,
          start_date: updates.startDate,
          deadline: updates.deadline,
          cost: Number(updates.cost) || 0,
          profit: Number(updates.profit) || 0,
          notes: updates.notes
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating project:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting project:', id);
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting project:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  return {
    projects,
    isLoading,
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate
  };
};