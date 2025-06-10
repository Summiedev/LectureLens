import express from "express";
import { login, register, logout } from "../controllers/authController.js";
import verifyToken from "../middleware/authmiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyToken, logout);

export default router;
