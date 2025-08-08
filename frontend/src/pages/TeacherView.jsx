import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Footer from '../components/footer';
import Header from '../components/header';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const socket = io('http://localhost:5000'); // your backend URL

export default function TeacherViewSession() {
  const { sessionId } = useParams();
  const [session, setSession]             = useState(null);
  const [slides, setSlides]               = useState([]);
  const [slideIndex, setSlideIndex]       = useState(0);
  const [participants, setParticipants]   = useState([]);
  const [focusPoints, setFocusPoints]     = useState({});
  const [activeTab, setActiveTab]         = useState('students');

  // ————————————————————————————————————————
  // 1. Load session details & slides & participants
  // ————————————————————————————————————————
  useEffect(() => {
    // Fetch session info
    fetch(`/api/sessions/${sessionId}`)
      .then(r => r.json())
      .then(data => setSession(data.session));
    // Fetch slides (with JSONB questions)
    fetch(`/api/sessions/${sessionId}/slides`)
      .then(r => r.json())
      .then(data => setSlides(data.slides));
    // Fetch participants
    fetch(`/api/sessions/${sessionId}/participants`)
      .then(r => r.json())
      .then(data => setParticipants(data.participants));
    // Fetch focus points
    fetch(`/api/sessions/${sessionId}/analytics`)
      .then(r => r.json())
      .then(({ leaderboard }) => {
        // map uuid→points
        const fp = {};
        leaderboard.forEach(({ participant_uuid, points }) => {
          fp[participant_uuid] = points;
        });
        setFocusPoints(fp);
      });
  }, [sessionId]);

  // ————————————————————————————————————————
  // 2. Socket.IO: join & listen for slide changes
  // ————————————————————————————————————————
  useEffect(() => {
    socket.emit('joinSession', { sessionId, role: 'teacher' });
    socket.on('slideChange', ({ slideIndex }) => {
      setSlideIndex(slideIndex);
    });
    return () => {
      socket.off('slideChange');
    };
  }, [sessionId]);

  // ————————————————————————————————————————
  // 3. Helper: Change slide (and notify via socket + persist)
  // ————————————————————————————————————————
  const changeSlide = async (newIndex) => {
    if (newIndex < 0 || newIndex >= slides.length) return;
    setSlideIndex(newIndex);
    socket.emit('slideChange', { sessionId, slideIndex: newIndex });
    // persist in DB
    await fetch(`/api/sessions/${sessionId}/updateCurrentSlide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slideIndex: newIndex })
    });
  };

  // ————————————————————————————————————————
  // 4. Render
  // ————————————————————————————————————————
  if (!session) return <div>Loading session...</div>;

  const currentSlide = slides[slideIndex] || {};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header/>
      <main className="flex-1 p-6">
        {/* Back button & session info */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => window.history.back()} className="text-blue-600 font-bold text-xl">←</button>
          <div>
            <h1 className="text-2xl font-semibold">{session.title}</h1>
            <p className="text-sm text-gray-500">{new Date(session.created_at).toLocaleString()}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {participants.slice(0, 5).map((p) => (
              <img
                key={p.uuid}
                className="w-8 h-8 rounded-full border-2 border-white"
                src={`https://randomuser.me/api/portraits/lego/${p.uuid.charCodeAt(0)%10}.jpg`}
                alt={p.name}
              />
            ))}
            {participants.length > 5 && (
              <div className="w-8 h-8 rounded-full bg-gray-300 text-sm flex items-center justify-center border-2 border-white">
                +{participants.length - 5}
              </div>
            )}
            <input
              value={session.code}
              readOnly
              className="bg-gray-100 px-4 py-1 rounded-md text-sm border border-gray-300"
            />
          </div>
        </div>

        {/* Slide Viewer */}
        <div className="relative bg-black rounded-lg overflow-hidden">
          <div className="flex justify-between absolute top-1/2 w-full px-4 z-10">
            <ChevronLeft
              className="w-8 h-8 text-white cursor-pointer"
              onClick={() => changeSlide(slideIndex - 1)}
            />
            <ChevronRight
              className="w-8 h-8 text-white cursor-pointer"
              onClick={() => changeSlide(slideIndex + 1)}
            />
          </div>
          <embed
            src={currentSlide.storage_path + `#page=${currentSlide.page_number}`}
            type="application/pdf"
            className="w-full h-[600px] object-contain"
          />
          <div
            onClick={() => changeSlide(slideIndex + 1)}
            className="text-white text-center bg-red-600 py-2 cursor-pointer font-semibold"
          >
            End session
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="mt-6 flex gap-4 overflow-x-auto">
          {/* Simplified: show overall avg from analytics */}
          {/* You can fetch per-slide avg and render similarly */}
        </div>

        {/* Tabs */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex mb-4 border rounded-lg overflow-hidden">
            <button
              className={`w-full py-2 text-center ${activeTab === 'students' ? 'bg-white font-semibold' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('students')}
            >
              Students
            </button>
            <button
              className={`w-full py-2 text-center ${activeTab === 'quizzes' ? 'bg-white font-semibold' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('quizzes')}
            >
              Quizzes
            </button>
          </div>

          {activeTab === 'students' && (
            <div className="space-y-3">
              {participants.map((p) => (
                <div key={p.uuid} className="flex items-center gap-4">
                  <img src={`https://randomuser.me/api/portraits/lego/${p.uuid.charCodeAt(0)%10}.jpg`} className="w-8 h-8 rounded-full" />
                  <p className="font-medium">{p.name}</p>
                  <span className="ml-auto text-blue-600 font-semibold">
                    {focusPoints[p.uuid] ?? 10} points
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'quizzes' && (
            <div className="space-y-4 text-gray-700">
              {Object.entries(currentSlide.slide_questions || {}).map(([page, qs]) => (
                <div key={page}>
                  <h3 className="font-semibold">Page {page}</h3>
                  <ul className="list-disc list-inside">
                    {qs.map((q, i) => (
                      <li key={i}>{q.question}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
