import { supabase } from "../config/db.js";
export const createSession = async ({ title, subject, teacherId, date }) => {
  const { data, error } = await supabase
    .from("sessions")
    .insert([{ title, subject, teacher_id: teacherId, date }])
    .select();
  return { data, error };
};

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
