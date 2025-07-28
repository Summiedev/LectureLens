import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://noebaxzcqhhsnzzlclqg.supabase.co",
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

async function handleFileUpload(file) {
  try {
    // Generate unique file path
    const fileExtension = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}.${fileExtension}`;
    const filePath = `${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("sessionfiles")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload failed:", error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from("sessionfiles")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error(`File upload failed: ${error.message}`);
  }
}
export { handleFileUpload };
