import { huggingface } from "@ai-sdk/huggingface";
import { generateObject, streamObject } from "ai";
import z from "zod";
// import dotenv from "dotenv"; dotenv.config();
const questionSchema = z.array(
  z.object({
    question: z.string(),
    answers: z.array(z.string()).min(2).max(4),
    correct_answer: z.string(),
    pageNumber: z.number().min(1),
  })
);

export const generateQuizQuestions = async (textPassages) => {
  const systemPrompt = [
    "You are an assistant that creates high-quality multiple-choice questions (MCQs) from textbook passages.",
    "Rules:",
    "- Input will be a JSON array of passages with their page numbers:",
    '  [ { "text": "...", "pageNumber": 1 }, { "text": "...", "pageNumber": 2 }, ... ]',
    "- For EACH passage in the input, generate as much questions as possible but MIN 5 and MAX 10!!!.",
    "- Each MCQ must strictly follow this JSON format:",
    "  {",
    '    "question": "clear, concise question text",',
    '    "answers": ["A", "B", "C", "D"],',
    '    "correct_answer": "one of the answers exactly as in `answers` not A , B but the excat string in the `answers`",',
    '    "pageNumber": <the pageNumber of the passage the question is based on>',
    "  }",
    "- Questions must ONLY use facts from the passage text.",
    "-No more than 4 answer choices per question.",
    "- You can use true / false",
    "- Only ONE correct answer per question.",
    "- Keep answers short!!!, concise, precise, and factual.",
    "- Return ALL results as a single JSON array. No commentary, no explanations.",
  ].join("\n");
  const prompt = [
    "Passages with page numbers:",
    JSON.stringify(textPassages, null, 2),
    "",
    "Now produce the final output in this shape:",
    "[",
    "  {",
    '    "question": "String",',
    '    "answers": ["String", "String", "String", "String"],',
    '    "correct_answer": "String",',
    '    "pageNumber": 1',
    "  }",
    "]",
    "",
    "Return ONLY the JSON array, nothing else.",
  ].join("\n");
  const { object, partialObjectStream } = await streamObject({
    model: huggingface("deepseek-ai/DeepSeek-V3.2-Exp"),
    system: systemPrompt,
    prompt: prompt,
    schema: questionSchema,
    mode: "json",
  });
  for await (const partial of partialObjectStream) {
    // console.log("Partial questions:", partial);
  }
  return object;
};
