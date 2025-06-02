import supabaseClient from "@/utils/supabase";
// import { SupabaseClient } from "@supabase/supabase-js";


export const getJobs = async (token, { location, company_id, searchQuery }) => {

  const supabase = await supabaseClient(token); // Pass token to supabaseClient
  let query = supabase
    .from('jobs')
    .select('*,company:companies(name,logo_url),saved: saved_jobs(id)') // Fetch jobs and include company details

  if (location) {
    query = query.eq('location', location);
  }
  if (company_id) {
    query = query.eq('company_id', company_id);
  }
  if (searchQuery) {
    query = query.ilike('title', `%${searchQuery}%`); // Use ilike for case-insensitive search
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
};


export async function saveJob(token, { alreadySaved }, saveData) {

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

export default async function getSingleJob(token, { jobId }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("jobs").select("*,company:companies(name,logo_url), applications: applications(*)").eq('id', jobId).single();

  if (error) {
    console.error("Error fetching jobs:", error);
    return null;
  }

  return data;
}


export  async function updateHiringStatus(token, { jobId }, isOpen) {
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

