import { createClient } from "@supabase/supabase-js";

const client = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_API_KEY
);

async function uploadFile(file, path) {
    const { data, error } = await client.storage
        .from("GunplaHub")
        .upload(path, file);

    if (error) {
        console.error("Upload error:", error.message);
        return null;
    }

    // Get the public URL
    const { data: publicUrlData } = client.storage
        .from("GunplaHub")
        .getPublicUrl(path);

    return {
        path: data.path,
        publicUrl: publicUrlData.publicUrl,
    };
}

export default uploadFile;
