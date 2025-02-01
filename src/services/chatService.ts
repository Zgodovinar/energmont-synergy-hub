import { supabase } from "@/integrations/supabase/client";

export const chatService = {
  async getOrCreateAdminWorker(email: string): Promise<string> {
    console.log('Getting or creating admin worker for:', email);
    
    const { data: existingWorker, error: workerError } = await supabase
      .from('workers')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (workerError) {
      console.error('Error checking worker:', workerError);
      throw new Error('Failed to check worker status');
    }

    if (existingWorker) {
      console.log('Found existing worker:', existingWorker.id);
      return existingWorker.id;
    }

    const { data: newWorker, error: createError } = await supabase
      .from('workers')
      .insert({
        name: 'Admin',
        role: 'Admin',
        email: email,
        status: 'active'
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating admin worker:', createError);
      throw new Error('Failed to create admin worker');
    }

    console.log('Created new admin worker:', newWorker.id);
    return newWorker.id;
  }
};