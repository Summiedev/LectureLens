import express from "express";
import verifyToken from "../middleware/authmiddleware.js";
import {
  createSession,
  uploadSlides,
  addQuestions,
  getAnalytics,
  joinSession,
  startSession,
  getSessionByID,
  logAttention,
  getQuiz,
  submitQuiz,
  deleteSession,
  listSessions,
  getSlides,
  getSlideQuestions,
  getParticipants,
  getParticipantReport,
  leaveSession,
  getDashboardSummary,
  updateCurrentSlide,
  exportSessionData,
} from "../controllers/sessionController.js";
const router = express.Router();

// Teacher-only
router.post("/", verifyToken, createSession);
router.post("/slides/:sessionId", verifyToken, uploadSlides);
router.post("/:sessionId/questions", verifyToken, addQuestions);
router.get("/:sessionId/analytics", verifyToken, getAnalytics);
router.post("/:sessionId/start", verifyToken, startSession);
router.delete("/:id", verifyToken, deleteSession);
// Public (students)
router.post("/join", joinSession);
router.post("/:sessionId/attention", logAttention);
router.get("/:sessionId/quiz", getQuiz);
router.post("/:sessionId/quiz", submitQuiz);

router.get("/", verifyToken, listSessions);
router.get("/:sessionId", getSessionByID);
router.get("/:sessionId/slides", verifyToken, getSlides);

router.get("/slides/:slideId/questions", verifyToken, getSlideQuestions);

router.get("/:sessionId/participants", verifyToken, getParticipants);
router.get(
  "/:sessionId/participants/:uuid/report",
  verifyToken,
  getParticipantReport
);

router.post("/:sessionId/leave", leaveSession);
router.get("/dashboard", verifyToken, getDashboardSummary);

router.post("/:sessionId/current-slide", verifyToken, updateCurrentSlide);
router.get("/:sessionId/export", verifyToken, exportSessionData);
export default router;
