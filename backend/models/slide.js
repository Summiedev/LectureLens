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
export const updateCurrentPage = async (sessionId, slideIndex) => {
  if (!sessionId && sessionId !== 0) throw new Error("sessionId is required");
  if (slideIndex === undefined || slideIndex === null)
    throw new Error("slideIndex is required");

  const { data, error } = await supabase
    .from("sessions")
    .update({ current_page: slideIndex })
    .eq("session_id", sessionId);

  if (error) {
    throw new Error(`Supabase update failed: ${error.message}`);
  }
};
