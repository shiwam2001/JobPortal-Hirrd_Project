import supabaseClient from "@/utils/supabase";

export default async function saveJob(token, { alreadySaved }, saveData) {

    const supabase = await supabaseClient(token); // Pass token to supabaseClient
  
    if (alreadySaved) {
      const { data, error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('job_id', saveData.job_id)
  
      if (deleteError) {
        console.log("Error deleting saved job:", deleteError);
        return null
        // throw error;
      }
  
      return data; // Return the deleted job data
    } else {
      const { data, error } = await supabase
        .from('saved_jobs')
        .insert([saveData])
        .select()
  
      if (insertError) {
        console.log("Error fetching jobs:", insertError);
        return null
        // throw error;
      }
  
      return data; // Return the inserted job data
    }
  };