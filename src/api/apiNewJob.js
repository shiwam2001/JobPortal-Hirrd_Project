import supabaseClient from "@/utils/supabase";

export default async function addNewJob(token,_, jobData) {
    const supabase = await supabaseClient(token);
    const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select()
  
    if (error) {
      console.error("Error creating jobs:", error);
      return null;
    }
  
    return data;
  }