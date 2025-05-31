import supabaseClient from "@/utils/supabase";

export default async function getCompanies(token) {
    const supabase = await supabaseClient(token); // Pass token to supabaseClient

    if (alreadySaved) {
        const { data, error } = await supabase
            .from('companies').select('*');
           

        if (deleteError) {
            console.log("Error Feteching Companies:", Error);
            return null
           
        }

        return data
    }
}