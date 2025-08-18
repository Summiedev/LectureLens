import { supabase } from "../config/db.js";
export const createSession = async ({ title, subject, teacherId, date }) => {
  const { data, error } = await supabase
    .from("sessions")
    .insert([{ title, subject, teacher_id: teacherId, date }])
    .select();
  return { data, error };
};
export async function deleteFileFromStorage(fileUrl) {
  try {
    const path = fileUrl.split("/sessionfiles/")[1];
    const { error } = await supabase.storage
      .from("sessionfiles")
      .remove([path]);
    if (error) {
      console.error("Failed to delete file from storage:", error.message);
    }
  } catch (err) {
    console.error("Error in deleteFileFromStorage:", err.message);
  }
}
export const getSessionById = async (id) => {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error("Error fetching session:", error);
  }
  return { data, error };
};

export const getAverageAttentionBySlide = async (sessionId, slideIndex) => {
  try {
    const { data, error } = await supabase
      .from("attention_logs")
      .select("avg_score:score.avg()")
      .eq("session_id", sessionId)
      .eq("slide_index", slideIndex)
      .single();
    if (error)
      throw new Error(`Error fetching average attention: ${error.message}`);
    return { data, error };
  } catch (err) {
    console.error("Error in getAverageAttentionBySlide:", err.message);
    return { data: null, error: err.message };
  }
};

export const updateSession = async (id, { title, subject, date }) => {
  const { data, error } = await supabase
    .from("sessions")
    .update({ title, subject, date })
    .eq("id", id);
  return { data, error };
};

export const deleteSession = async (id) => {
  const { data, error } = await supabase.from("sessions").delete().eq("id", id);
  return { data, error };
};
