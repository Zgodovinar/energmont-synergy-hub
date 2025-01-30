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
        status: (project.status || 'pending') as Project['status'],
        startDate: project.start_date,
        deadline: project.deadline,
        cost: Number(project.cost) || 0,
        profit: Number(project.profit) || 0,
        notes: project.notes || '',
        location: project.location,
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
      
      // First create the project
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
      
      if (projectError) {
        console.error('Error creating project:', projectError);
        throw projectError;
      }

      // Then create worker assignments if any
      if (newProject.assignedWorkerIds?.length) {
        const { error: workersError } = await supabase
          .from('project_workers')
          .insert(
            newProject.assignedWorkerIds.map(workerId => ({
              project_id: projectData.id,
              worker_id: workerId
            }))
          );

        if (workersError) {
          console.error('Error assigning workers:', workersError);
          throw workersError;
        }
      }

      // Finally create image records if any
      if (newProject.images?.length) {
        const { error: imagesError } = await supabase
          .from('project_images')
          .insert(
            newProject.images.map(imageUrl => ({
              project_id: projectData.id,
              image_url: imageUrl
            }))
          );

        if (imagesError) {
          console.error('Error saving images:', imagesError);
          throw imagesError;
        }
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
      
      // Update project details
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
      
      if (projectError) {
        console.error('Error updating project:', projectError);
        throw projectError;
      }

      // Update worker assignments
      if (updates.assignedWorkerIds) {
        // First remove all existing assignments
        await supabase
          .from('project_workers')
          .delete()
          .eq('project_id', id);

        // Then add new assignments
        if (updates.assignedWorkerIds.length > 0) {
          const { error: workersError } = await supabase
            .from('project_workers')
            .insert(
              updates.assignedWorkerIds.map(workerId => ({
                project_id: id,
                worker_id: workerId
              }))
            );

          if (workersError) {
            console.error('Error updating worker assignments:', workersError);
            throw workersError;
          }
        }
      }

      // Update images if provided
      if (updates.images) {
        // Remove existing images
        await supabase
          .from('project_images')
          .delete()
          .eq('project_id', id);

        // Add new images
        if (updates.images.length > 0) {
          const { error: imagesError } = await supabase
            .from('project_images')
            .insert(
              updates.images.map(imageUrl => ({
                project_id: id,
                image_url: imageUrl
              }))
            );

          if (imagesError) {
            console.error('Error updating images:', imagesError);
            throw imagesError;
          }
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