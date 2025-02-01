import { supabase } from "@/integrations/supabase/client";

export const workerService = {
  async getOrCreateAdminWorker(email: string): Promise<string> {
    console.log('Getting or creating admin worker for email:', email);
    
    const { data: existingWorker, error: fetchError } = await supabase
      .from('workers')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching worker:', fetchError);
      throw fetchError;
    }

    if (existingWorker) {
      console.log('Found existing worker:', existingWorker.id);
      return existingWorker.id;
    }

    const { data: newWorker, error: createError } = await supabase
      .from('workers')
      .insert({
        email,
        name: email.split('@')[0],
        role: 'admin',
        status: 'active'
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating worker:', createError);
      throw createError;
    }

    console.log('Created new admin worker:', newWorker.id);
    return newWorker.id;
  }
};