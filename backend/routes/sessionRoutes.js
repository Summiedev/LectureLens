import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import {
  createSession,
  uploadSlides,
  addQuestions,
  getAnalytics,
  joinSession,
  logAttention,
  getQuiz,
  submitQuiz,
  deleteSession,
} from "../controllers/sessionController.js";
const router = express.Router();

// Teacher-only
router.post("/", verifyToken, createSession);
router.post("/:sessionId/slides", verifyToken, uploadSlides);
router.post("/:sessionId/slides/:slideId/questions", verifyToken, addQuestions);
router.get("/:sessionId/analytics", verifyToken, getAnalytics);
router.delete("/:id", verifyToken, deleteSession);
// Public (students)
router.post("/join", joinSession);
router.post("/:sessionId/attention", logAttention);
router.get("/:sessionId/quiz", getQuiz);
router.post("/:sessionId/quiz", submitQuiz);

export default router;
