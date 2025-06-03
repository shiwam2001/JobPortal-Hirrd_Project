import supabaseClient from "@/utils/supabase";
// import { SupabaseClient } from "@supabase/supabase-js";


export default  async function getJobs(token, { location, company_id, searchQuery })  {
  

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


// import { SupabaseClient } from "@supabase/supabase-js";

// export  async function getSingleJob(token, { jobId }) {
//   const supabase = await supabaseClient(token);
//   const { data, error } = await supabase.from("jobs").select("*,company:companies(name,logo_url), applications: applications(*)").eq('id', jobId).single();

//   if (error) {
//     console.error("Error fetching jobs:", error);
//     return null;
//   }

//   return data;
// }
