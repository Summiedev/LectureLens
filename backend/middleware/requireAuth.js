import { supabase } from "../config/db.js";
import { getTeacherByEmail } from "../models/teacher.js";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const teacher = await getTeacherByEmail(user.email);

    req.user = user;
    req.teacher = teacher
      ? { id: teacher.id, name: teacher.name, email: teacher.email }
      : null;

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ error: "Token verification failed" });
  }
};

export default verifyToken;