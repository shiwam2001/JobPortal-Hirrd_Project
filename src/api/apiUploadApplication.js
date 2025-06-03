import supabaseClient from "@/utils/supabase";

export default async function updateApplications(token, {job_id},status) {
    const supabase = await supabaseClient(token);
    const { data, error } = await supabase
    .update({status})
    .eq("job_id", job_id)
    .select();
  
    if (error || data.length === 0) {
      console.error("Error Updating Application Status:", error);
      return null;
    }
  
    return data;
  }