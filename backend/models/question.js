import { supabase } from "../config/db.js";

export const createQuestion = async ({
  sessionId,
  questionText,
  answers,
  correct_answer,
  pageNumber,
}) => {
  const { data, error } = await supabase
    .from("questions")
    .insert([
      {
        session_id: sessionId,
        question_text: questionText,
        answers: answers,
        correct_answer: correct_answer,
        page_number: pageNumber,
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
