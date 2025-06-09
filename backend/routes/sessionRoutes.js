import express from "express";
import {
  createSessionController,
  deleteSessionController,
} from "../controllers/sessionController.js";
const router = express.Router();

router.post("/", createSessionController);
router.delete("/:id", deleteSessionController);

export default router;
