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
   console.log("Created session:", data);
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
// export const uploadSlides = async (req, res) => {
//   const { sessionId } = req.params;
//   const { slideUrl, title } = req.body;

//   // this wont work i got the error TypeError: slideUrls.map is not a function
//   // const rows = slideUrls.map((url) => ({
//   //   session_id: sessionId,
//   //   title: title,
//   //   storage_path: url,
//   // }));

//   const { data, error } = await createSlide(sessionId, title, slideUrl);
//   if (error) return res.status(500).json({ error: error.message });
//   res.json({ success: true, slideData: data });
// };

export const uploadSlides = async (req, res) => {
  const { sessionId } = req.params;
  const { title, pdfUrl, slideQuestions } = req.body;

  try {
    const { data, error } = await createSlide(sessionId, title, pdfUrl, slideQuestions);
    if (error) throw error;

    res.status(201).json({
      success: true,
      slideData: data
    });
  } catch (err) {
    console.error("❌ Slide upload failed:", err.message);
    res.status(500).json({ error: "Slide upload failed" });
  }
};
// Add questions to a slide Leave this one
export const addQuestions = async (req, res) => {
  const { slideId } = req.params;
  const { questions } = req.body;

  try {
    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: "Invalid questions format" });
    }

    const created = [];

    for (const q of questions) {
      const { question_text, answers, correct_answer } = q;

      if (!question_text || !answers || !correct_answer) {
        continue; // Skip invalid entries
      }

      const { data, error } = await createQuestion({
        slideId,
        questionText: question_text,
        answers,
        correct_answer
      });

      if (error) {
        console.error("Failed to insert question:", error.message);
        continue;
      }

      created.push(data);
    }

    res.status(201).json({ success: true, questions: created });
  } catch (err) {
    console.error("❌ Failed to insert questions:", err.message);
    res.status(500).json({ error: "Failed to insert questions" });
  }
};

// stopped testing here

// Student joins by code + name Done
export const joinSession = async (req, res) => {
  const { sessionCode, name } = req.body;

  const { data: session, error: sessErr } = await supabase
    .from("sessions")
    .select("session_id")
    .eq("session_id", sessionCode)
    .single();

  if (sessErr || !session) return res.status(404).json({ error: "Session not found" });

  const participant_uuid = uuidv4();

  const { error } = await supabase.from("participants").insert([
    {
      session_id: session.session_id,
      id: participant_uuid,
      name,
    },
  ]);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ sessionId: session.session_id, participantUuid: participant_uuid });
};

// Log attention score done done
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
  res.json({ success: true ,data: { sessionId, participantUuid, slideIndex, attentionScore, timestamp } });
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

// Teacher analytics: heatmap + leaderboard done
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

export const listSessions = async (req, res) => {
  const teacherId = req.teacher.id;

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ sessions: data });
};

export const getSlides = async (req, res) => {
  const { sessionId } = req.params;

  const { data, error } = await supabase
    .from("slides")
    .select("*")
    .eq("session_id", sessionId)
    .order("slide_index");

  if (error) return res.status(500).json({ error: error.message });
  res.json({ slides: data });
};

export const getSlideQuestions = async (req, res) => {
  const { slideId } = req.params;

  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("slide_id", slideId);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ questions: data });
};
export const getParticipants = async (req, res) => {
  const { sessionId } = req.params;

  const { data, error } = await supabase
    .from("participants")
    .select("uuid, name, joined_at")
    .eq("session_id", sessionId);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ participants: data });
};


export const getParticipantReport = async (req, res) => {
  const { sessionId, uuid } = req.params;

  const { data: attention, error: aErr } = await supabase
    .from("attention_logs")
    .select("*")
    .eq("session_id", sessionId)
    .eq("participant_uuid", uuid);

  const { data: responses, error: qErr } = await supabase
    .from("quiz_responses")
    .select("*")
    .eq("session_id", sessionId)
    .eq("participant_uuid", uuid);

  const { data: focus, error: fErr } = await supabase
    .from("focus_points")
    .select("points, history")
    .match({ session_id: sessionId, participant_uuid: uuid })
    .single();

  if (aErr || qErr || fErr) {
    return res.status(500).json({
      error: aErr?.message || qErr?.message || fErr?.message,
    });
  }

  res.json({
    attention,
    responses,
    focus,
  });
};

//done
export const leaveSession = async (req, res) => {
  const { sessionId } = req.params;
  const { participantUuid } = req.body;

  const { error } = await supabase
    .from("participants")
    .update({ left: true })
    .eq("session_id", sessionId)
    .eq("uuid", participantUuid);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Participant marked as left" });
};

export const getDashboardSummary = async (req, res) => {
  const teacherId = req.teacher?.id;

  const { data: sessions, error: sErr } = await supabase
    .from("sessions")
    .select("session_id")
    .eq("teacher_id", teacherId); // added filter to only get sessions for this teacher

  if (sErr || !sessions) {
    return res.status(500).json({ error: sErr?.message || "Could not fetch sessions" });
  }

  const sessionIds = sessions.map((s) => s.id);

  const { data: focusStats, error: fErr } = await supabase
    .from("focus_points")
    .select("*")
    .in("session_id", sessionIds);

  if (fErr || !focusStats) {
    return res.status(500).json({ error: fErr?.message || "Could not fetch focus stats" });
  }

  const totalSessions = sessions.length;
  const totalStudents = focusStats.length;
  const topPerformers = focusStats
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  res.json({
    totalSessions,
    totalStudents,
    topPerformers,
  });
};

export const updateCurrentSlide = async (req, res) => {
  const { sessionId } = req.params;
  const { slideIndex } = req.body;

  const { error } = await supabase
    .from("sessions")
    .update({ current_slide: slideIndex })
    .eq("id", sessionId);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
};
export const exportSessionData = async (req, res) => {
  const { sessionId } = req.params;

  const [attn, quiz, participants] = await Promise.all([
    supabase.from("attention_logs").select("*").eq("session_id", sessionId),
    supabase.from("quiz_responses").select("*").eq("session_id", sessionId),
    supabase.from("participants").select("*").eq("session_id", sessionId),
  ]);

  if (attn.error || quiz.error || participants.error) {
    return res.status(500).json({
      error:
        attn.error?.message ||
        quiz.error?.message ||
        participants.error?.message,
    });
  }

  res.json({
    attention_logs: attn.data,
    quiz_responses: quiz.data,
    participants: participants.data,
  });
};
