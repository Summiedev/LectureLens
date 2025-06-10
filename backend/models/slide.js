import { supabase } from "../config/db.js";
export const createSlide = async (sessionId, title, slideUrl,slideQuestions) => {
  const { data, error } = await supabase
    .from("slides")
    .insert({
      session_id: sessionId,
      title: title,
      storage_path: slideUrl,
      questions: slideQuestions
    })
    .select()
    .single();
  if (error) throw error;
  return { data, error };
};
