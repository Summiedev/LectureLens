import { supabase } from "../config/db.js";

export const createQuestion = async ({
  slideId,
  questionText,
  answers,
  correct_answer,
}) => {
  const { data, error } = await supabase
    .from("questions")
    .insert([
      {
        slide_id: slideId,
        question_text: questionText,
        answers: answers,
        correct_answer: correct_answer,
      },
    ])
    .select()
    .single();
  return { data, error };
};
export const getQuestionById = async (id) => {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", id)
    .single();
  return { data, error };
};
