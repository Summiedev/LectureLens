import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import Header from "../components/header";
import RecentSessions from "../components/recentSessions";

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const teacherId = localStorage.getItem("teacherId"); // adjust if using context
  const SERVER_URL = "http://localhost:5000"; // adjust to your backend URL
  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch(`${SERVER_URL}/api/sessions/teacher/${teacherId}`);
        const data = await res.json();

        const formatted = (data.sessions || []).map(s => ({
          id: s.id,
          title: s.title || "Untitled Session",
          date: s.created_at,
          attention: s.attention || Math.random() * 100, // fallback if no attention yet
          image: s.cover_image || "/default-cover.jpg", // fallback image
          avatars: s.participants?.length || 3
        }));

        setSessions(formatted.reverse());
      } catch (err) {
        console.error("Error fetching sessions", err);
      } finally {
        setLoading(false);
      }
    }

    if (teacherId) fetchSessions();
  }, [teacherId]);

  const handleCreateSession = () => navigate("/create-session");

  const handleClearHistory = () => {
    // Add actual backend deletion logic if needed
    setSessions([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center text-center px-4 py-10">
        {loading ? (
          <p className="text-gray-500">Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center space-y-4">
            <svg
              className="w-24 h-24 text-green-200"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" stroke="#A3BDAA" fill="none" strokeWidth="1" />
              <line x1="25" y1="50" x2="25" y2="60" stroke="#A3BDAA" strokeWidth="1" />
              <line x1="75" y1="50" x2="75" y2="60" stroke="#A3BDAA" strokeWidth="1" />
            </svg>
            <h2 className="text-gray-900 font-semibold text-lg">
              You don’t have any active session.
            </h2>
            <p className="text-gray-500 text-sm">
              Looks like you haven’t created a class session yet. Start by launching your first interactive session.
            </p>
            <button
              onClick={handleCreateSession}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium"
            >
              Create a session
            </button>
          </div>
        ) : (
          <RecentSessions sessions={sessions} onClearHistory={handleClearHistory} />
        )}
      </main>
      <Footer />
    </div>
  );
}
