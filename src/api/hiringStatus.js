import supabaseClient from "@/utils/supabase";

export default async function updateHiringStatus(token, { jobId }, isOpen) {
    const supabase = await supabaseClient(token);
    const { data, error } = await supabase.from("jobs")
      .update({ isOpen })
      .eq('id', jobId)
      .select();
      
    if (error) {
      console.error("Error Updating jobs:", error);
      return null;
    }
  
    return data;
  }