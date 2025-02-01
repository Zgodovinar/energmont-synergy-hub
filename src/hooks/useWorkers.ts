import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Worker, CreateWorkerInput } from "@/types/worker";

export const useWorkers = () => {
  const queryClient = useQueryClient();

  const { data: workers = [], isLoading } = useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      console.log('Fetching workers...');
      const { data: workersData, error: workersError } = await supabase
        .from('workers')
        .select('*');

      if (workersError) {
        console.error('Error fetching workers:', workersError);
        throw workersError;
      }

      // Fetch project counts for each worker
      const workersWithProjects = await Promise.all(
        workersData.map(async (worker) => {
          const { data: projectCount, error: countError } = await supabase
            .rpc('get_worker_projects_count', { worker_uuid: worker.id });

          if (countError) {
            console.error('Error fetching project count:', countError);
            return {
              ...worker,
              projects: 0
            };
          }

          return {
            ...worker,
            projects: projectCount || 0
          };
        })
      );

      console.log('Workers fetched with project counts:', workersWithProjects);
      
      return workersWithProjects.map(worker => ({
        id: worker.id,
        name: worker.name,
        role: worker.role,
        email: worker.email || '',
        phone: worker.phone || '',
        address: worker.address || '',
        image: worker.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        pay: Number(worker.pay) || 0,
        status: (worker.status as Worker['status']) || 'active',
        projects: worker.projects
      }));
    }
  });

  const createWorkerMutation = useMutation({
    mutationFn: async (newWorker: CreateWorkerInput) => {
      console.log('Creating worker:', newWorker);
      const { data, error } = await supabase
        .from('workers')
        .insert({
          name: newWorker.name,
          role: newWorker.role,
          email: newWorker.email,
          phone: newWorker.phone,
          address: newWorker.address,
          pay: newWorker.pay,
          status: 'active'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating worker:', error);
        throw error;
      }

      console.log('Worker created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    }
  });

  const updateWorkerMutation = useMutation({
    mutationFn: async ({ id, ...updates }: CreateWorkerInput & { id: string }) => {
      console.log('Updating worker:', id, updates);
      const { error } = await supabase
        .from('workers')
        .update({
          name: updates.name,
          role: updates.role,
          email: updates.email,
          phone: updates.phone,
          address: updates.address,
          pay: updates.pay
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating worker:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    }
  });

  const deleteWorkerMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting worker:', id);
      const { error } = await supabase
        .from('workers')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting worker:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    }
  });

  const updateWorkerImage = async (workerId: string, imageUrl: string) => {
    const { error } = await supabase
      .from('workers')
      .update({ image_url: imageUrl })
      .eq('id', workerId);

    if (error) {
      console.error('Error updating worker image:', error);
      throw error;
    }

    queryClient.invalidateQueries({ queryKey: ['workers'] });
  };

  return {
    workers,
    isLoading,
    createWorker: createWorkerMutation.mutate,
    updateWorker: updateWorkerMutation.mutate,
    deleteWorker: deleteWorkerMutation.mutate,
    updateWorkerImage
  };
};