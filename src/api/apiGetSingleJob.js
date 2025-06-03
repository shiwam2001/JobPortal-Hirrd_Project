import supabaseClient from "@/utils/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export  async function getSingleJob(token, { jobId }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("jobs").select("*,company:companies(name,logo_url), applications: applications(*)").eq('id', jobId).single();

  if (error) {
    console.error("Error fetching jobs:", error);
    return null;
  }

  return data;
}