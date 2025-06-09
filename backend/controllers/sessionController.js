import { createSession, deleteSession } from "../models/session.js";

export const createSessionController = async (req, res) => {
  try {
    const { title, subject, date, teacherId } = req.body;

    // Validate input
    if (!title || !subject || !teacherId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create session
    const { data, error } = await createSession({
      title,
      subject,
      date: date || new Date().toISOString(), // Default to current date if not provided
      teacherId: parseInt(teacherId),
    });

    if (error) {
      console.error("Error creating session:", error);
      return res
        .status(500)
        .json({ error: "Failed to create session", details: error.message });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error("❌ Create session error:", err);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const deleteSessionController = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate input
    if (!id) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    // Delete session
    const { data, error } = await deleteSession(id);

    if (error) {
      console.error("Error deleting session:", error);
      return res.status(500).json({ error: "Failed to delete session" });
    }

    res.status(200).json({ message: "Session deleted successfully", data });
  } catch (err) {
    console.error("❌ Delete session error:", err);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};
