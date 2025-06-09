import jwt from "jsonwebtoken";
import * as User from "../models/teacher.js";

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token)
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.getTeacherById(decoded.id);
    if (!user.data) return res.status(401).json({ error: "Invalid token." });

    req.user = user.data;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ error: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired." });
    }
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default authenticateUser;
