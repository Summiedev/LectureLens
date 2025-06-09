import { supabase } from "../config/db.js";

export const createTeacher = async ({ name, email, supabase_user_id }) => {
  const { data, error } = await supabase
    .from("teachers")
    .insert([{ name, email, supabase_user_id }])
    .select()
    .single();
  return { data, error };
};

export const getTeacherById = async (id) => {
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("id", id)
    .single();
  return { data, error };
};

export const getTeacherByEmail = async (email) => {
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("email", email)
    .single();
  return { data, error };
};

export const updateTeacher = async (id, { name, email, password }) => {
  const { data, error } = await supabase
    .from("teachers")
    .update({ name, email, password })
    .eq("id", id);
  return { data, error };
};

export const deleteTeacher = async (id) => {
  const { data, error } = await supabase.from("teachers").delete().eq("id", id);
  return { data, error };
};
