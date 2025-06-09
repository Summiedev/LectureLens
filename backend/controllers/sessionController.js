// controllers/sessionController.js
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../config/db.js";
import { createSession as createSessionService } from "../models/session.js";
import { deleteSession as deleteSessionService } from "../models/session.js";
import { createSlide } from "../models/slide.js";
import { createQuestion } from "../models/question.js";
// Create a new session (teacher-only)
export const createSession = async (req, res) => {
  const { title, subject } = req.body;
  const teacherId = req.teacher.id;

  const { data, error } = await createSessionService({
    title,
    subject,
    teacherId,
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ sessionId: data?.[0]?.id });
};
// Delete session
export const deleteSession = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await deleteSessionService(id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ message: "Session deleted successfully" });
};

// Upload slide URLs
export const uploadSlides = async (req, res) => {
  const { sessionId } = req.params;
  const { slideUrl, title } = req.body;

  // this wont work i got the error TypeError: slideUrls.map is not a function
  // const rows = slideUrls.map((url) => ({
  //   session_id: sessionId,
  //   title: title,
  //   storage_path: url,
  // }));

  const { data, error } = await createSlide(sessionId, title, slideUrl);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, slideData: data });
};

// Add questions to a slide
export const addQuestions = async (req, res) => {
  try {
    const { slideId } = req.params;
    const { questionText, answers, correct_answer } = req.body;

    // Validation
    if (!slideId || !questionText || !answers || correct_answer === undefined) {
      return res.status(400).json({
        error:
          "slideId, questionText, answers, and correct_answer are required",
      });
    }

    const { data, error } = await createQuestion({
      slideId,
      questionText,
      answers,
      correct_answer,
    });

    if (error) {
      console.error("Create question error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, question_data: data });
  } catch (err) {
    console.error("Add questions error:", err);
    res.status(500).json({ error: "Failed to add question" });
  }
};

// stopped testing here

// Student joins by code + name
export const joinSession = async (req, res) => {
  const { sessionCode, name } = req.body;
  const { data: session, error: sessErr } = await supabase
    .from("sessions")
    .select("id")
    .eq("code", sessionCode)
    .single();
  if (sessErr) return res.status(404).json({ error: "Session not found" });

  const participant_uuid = uuidv4();
  const { error } = await supabase.from("participants").insert([
    {
      session_id: session.id,
      uuid: participant_uuid,
      name,
    },
  ]);
  if (error) return res.status(500).json({ error: error.message });

  res.json({ sessionId: session.id, participantUuid: participant_uuid });
};

// Log attention score
export const logAttention = async (req, res) => {
  const { sessionId } = req.params;
  const { participantUuid, slideIndex, attentionScore, timestamp } = req.body;
  const { error } = await supabase.from("attention_logs").insert([
    {
      session_id: sessionId,
      participant_uuid: participantUuid,
      slide_index: slideIndex,
      score: attentionScore,
      ts: new Date(timestamp),
    },
  ]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
};

// Fetch micro-quiz for a slide
export const getQuiz = async (req, res) => {
  const { sessionId } = req.params;
  const { slideIndex } = req.query;
  const { data: slide } = await supabase
    .from("slides")
    .select("id")
    .eq("session_id", sessionId)
    .eq("slide_index", slideIndex)
    .single();

  const { data: questions } = await supabase
    .from("questions")
    .select("id, text, options")
    .eq("slide_id", slide.id)
    .limit(2)
    .order("id", { ascending: false });

  res.json({ questions });
};

// Record quiz responses & update focus points
export const submitQuiz = async (req, res) => {
  const { sessionId } = req.params;
  const { participantUuid, responses } = req.body;

  const respRows = responses.map((r) => ({
    session_id: sessionId,
    participant_uuid: participantUuid,
    question_id: r.questionId,
    correct: r.correct,
    ts: new Date(),
  }));
  let { error } = await supabase.from("quiz_responses").insert(respRows);
  if (error) return res.status(500).json({ error: error.message });

  let { data: fp } = await supabase
    .from("focus_points")
    .select("points, history")
    .match({ session_id: sessionId, participant_uuid: participantUuid })
    .single();

  if (!fp) {
    fp = { points: 10, history: [] };
    await supabase.from("focus_points").insert([
      {
        session_id: sessionId,
        participant_uuid: participantUuid,
        points: 10,
        history: [],
      },
    ]);
  }

  const delta = responses.reduce((sum, r) => sum + (r.correct ? 1 : -1), 0);
  const newPoints = Math.max(0, fp.points + delta);
  const newHistory = [...fp.history, { type: "quiz", delta, ts: new Date() }];

  ({ error } = await supabase
    .from("focus_points")
    .update({
      points: newPoints,
      history: newHistory,
    })
    .match({ session_id: sessionId, participant_uuid: participantUuid }));

  if (error) return res.status(500).json({ error: error.message });
  res.json({ updatedFocus: newPoints });
};

// Teacher analytics: heatmap + leaderboard
export const getAnalytics = async (req, res) => {
  const { sessionId } = req.params;

  const { data: attentionBySlide } = await supabase.rpc(
    "avg_attention_by_slide",
    { sid: sessionId }
  );
  const { data: leaderboard } = await supabase
    .from("focus_points")
    .select("participant_uuid, points")
    .eq("session_id", sessionId)
    .order("points", { ascending: false });

  res.json({ attentionBySlide, leaderboard });
};
