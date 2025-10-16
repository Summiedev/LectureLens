import { createTeacher, getTeacherByEmail } from "../models/teacher.js";
import { supabase } from "../config/db.js";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if email already in use
    const { data, error } = await getTeacherByEmail(email);
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }
    if (data) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (authError) {
      return res.status(400).json({
        error: authError.message,
      });
    }

    // Create teacher
    const { data: teacher, error: createError } = await createTeacher({
      name,
      email,
      supabase_user_id: authData.user?.id,
    });

    if (createError) {
      console.error("Error creating teacher:", createError);
      return res.status(500).json({ error: "Failed to create teacher" });
    }

    res.status(201).json({
      token: authData.session.access_token,
      session: authData.session,
      teacher: {
        id: teacher?.id,
        name: teacher?.name,
        email: teacher?.email,
        supabase_user_id: authData.user?.id,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(error);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { data: teacher, error: teacherError } = await getTeacherByEmail(
      email
    );
    if (teacherError || !teacher) {
      return res.status(401).json({ error: "Couldn't find teacher" });
    }

    res.json({
      user: data.user,
      session: data.session,
      teacher: teacher
        ? {
            id: teacher.supabase_user_id,
            name: teacher.name,
            email: teacher.email,
          }
        : null,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
};

const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Logout failed" });
  }
};

export { login, register, logout };
