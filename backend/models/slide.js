import { supabase } from "../config/db.js";
export const createSlide = async (sessionId, title, slideUrl) => {
  const { data, error } = await supabase
    .from("slides")
    .insert({
      session_id: sessionId,
      title: title,
      storage_path: slideUrl,
    })
    .select()
    .single();
  if (error) throw error;
  return { data, error };
};
