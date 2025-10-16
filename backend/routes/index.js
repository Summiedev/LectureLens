import express from "express";
import authRoutes from "./authRoutes.js";
import sessionRoutes from "./sessionRoutes.js";

const router = express.Router();

// const userRoutes = require('./userRoutes');

router.use("/auth", authRoutes);
router.use("/sessions", sessionRoutes);

router.get("/", (req, res) => {
  res.send("API is working!");
});

export default router;
