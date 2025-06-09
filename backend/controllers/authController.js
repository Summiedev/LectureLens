import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createTeacher, getTeacherByEmail } from "../models/teacher.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already in use
    const existing = await getTeacherByEmail(email);
    if (existing) {
      return res
        .status(400)
        .json({ field: "email", message: "Email already in use" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create teacher
    const teacher = await createTeacher({
      name,
      email,
      password: hashed,
    });

    // Generate token
    const token = generateToken(teacher.id);

    res.status(201).json({
      token,
      teacher: { id: teacher.id, name: teacher.name, email: teacher.email },
    });
  } catch (err) {
    console.error("Registration error:", err);
    if (err.code === 11000 && err.keyPattern.email) {
      return res.status(400).json({
        field: "email",
        message: "Email already in use. Please use another.",
      });
    }
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await getTeacherByEmail(email);
    if (!teacher) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, teacher.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(teacher.id);
    res.json({
      token,
      teacher: { id: teacher.id, name: teacher.name, email: teacher.email },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
};

export { login, register };
