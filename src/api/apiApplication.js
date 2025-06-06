import  supabaseClient, { supabaseUrl } from "@/utils/supabase";


export default  async function applyTojob(token,_,jobData) {
    const supabase = await supabaseClient(token);

    const random =Math.floor(Math.random() * 90000);
    const fileName = `resume-${random}-${jobData.candidate_id}`;

    const {error: storageError} = await supabase.storage
        .from("resumes")
        .upload(fileName, jobData.resume,    
        );

    
    if (storageError) throw new Error(`Error uploading file: ${storageError.message}`);

    const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

    const { data, error } = await supabase
        .from("applications")
        .insert([{
            ...jobData,resume           
        }])
        .select();

    if (error) {
        throw new Error("Error submitting application:", error);
    }
    
    return data;
}

