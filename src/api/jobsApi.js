import supabaseClient from "@/utils/supabase";

export async function getApplications(token, { user_id }) {
    const supabase = await supabaseClient(token)
    
    const { data, error } = await supabase.from("application")
    .select("*,job:jobs(title,company:companies(name))")
    .eq("candidate_id",user_id);

    if(error){
        console.error("Error Fetching Applications:", error)
        return null
    }
    
    return data
}

export async function getMyJobs(token){
    const supabase = await supabaseClient(token)

    const {data,error} = await supabase.from("saved_jobs")
    .select("*,company:companies(name,logo_url)")
    .eq("recruiter_id",recruiter_id)

    if(error){
        console.error("Error Fetching Jobs", error)
        return null
    }

    return data
}

export async function deleteJob(token,{ job_id }){
    const supabase = await supabaseClient(token)

    const {data,error} = await supabase.from("saved_jobs")
    .delete().eq("id",job_id)
    .select()

    if(error){
        console.error("Error Deleting Job", error)
        return null
    }

    return data
}
