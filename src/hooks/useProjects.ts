import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Project, CreateProjectInput } from "@/types/project";
import { transformDatabaseProject } from "@/utils/projectTransformers";

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
      return data.map(transformDatabaseProject);
    }
  });

  const createProjectMutation = useMutation({
    mutationFn: async (newProject: CreateProjectInput) => {
      console.log('Creating project:', newProject);
      
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: newProject.name,
          description: newProject.description,
          status: newProject.status,
          start_date: newProject.startDate,
          deadline: newProject.deadline,
          cost: Number(newProject.cost) || 0,
          profit: Number(newProject.profit) || 0,
          notes: newProject.notes,
          location: newProject.location
        })
        .select()
        .single();
      
      if (projectError) throw projectError;

      if (newProject.assignedWorkerIds?.length) {
        const { error: workersError } = await supabase
          .from('project_workers')
          .insert(
            newProject.assignedWorkerIds.map(workerId => ({
              project_id: projectData.id,
              worker_id: workerId
            }))
          );

        if (workersError) throw workersError;
      }

      if (newProject.images?.length) {
        const { error: imagesError } = await supabase
          .from('project_images')
          .insert(
            newProject.images.map(imageUrl => ({
              project_id: projectData.id,
              image_url: imageUrl
            }))
          );

        if (imagesError) throw imagesError;
      }

      return projectData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, ...updates }: CreateProjectInput & { id: string }) => {
      console.log('Updating project:', id, updates);
      
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          name: updates.name,
          description: updates.description,
          status: updates.status,
          start_date: updates.startDate,
          deadline: updates.deadline,
          cost: Number(updates.cost) || 0,
          profit: Number(updates.profit) || 0,
          notes: updates.notes,
          location: updates.location
        })
        .eq('id', id);
      
      if (projectError) throw projectError;

      if (updates.assignedWorkerIds !== undefined) {
        await supabase
          .from('project_workers')
          .delete()
          .eq('project_id', id);

        if (updates.assignedWorkerIds.length > 0) {
          const { error: workersError } = await supabase
            .from('project_workers')
            .insert(
              updates.assignedWorkerIds.map(workerId => ({
                project_id: id,
                worker_id: workerId
              }))
            );

          if (workersError) throw workersError;
        }
      }

      if (updates.images !== undefined) {
        await supabase
          .from('project_images')
          .delete()
          .eq('project_id', id);

        if (updates.images.length > 0) {
          const { error: imagesError } = await supabase
            .from('project_images')
            .insert(
              updates.images.map(imageUrl => ({
                project_id: id,
                image_url: imageUrl
              }))
            );

          if (imagesError) throw imagesError;
        }
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
      
      if (error) throw error;
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