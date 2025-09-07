import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.AI_API_KEY,
});

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
    '    "correct_answer": "one of the answers exactly as in `answers`",',
    '    "pageNumber": <the pageNumber of the passage the question is based on>',
    "  }",
    "- Questions must ONLY use facts from the passage text.",
    "- Do not use 'All of the above' or 'None of the above'.",
    "- Only ONE correct answer per question.",
    "- Keep answers short!!!, concise, precise, and factual.",
    "- Return ALL results as a single JSON array. No commentary, no explanations.",
  ].join("\n");

  const userPrompt = [
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

  const resp = await client.chat.completions.create({
    model: "mistralai/mistral-7b-instruct:free",
    temperature: 0.2,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  console.log(resp?.choices[0]?.message?.content);
};
