import express from "express";
// import authMiddleware from "../middleware/authmiddleware.js";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;
