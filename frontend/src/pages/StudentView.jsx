import React, { useState, useEffect } from 'react';
import FastFocusTracker from './StudentCamera';
import { Camera, EyeOff } from 'lucide-react';
import HeroSection from '../assets/presentation screen.png';
import { io } from 'socket.io-client';
import PDFSlideViewer from '../components/pdfViewer';

const socket = io('http://localhost:5000'); // adjust host:port

export default function StudentViewPage() {
  const [showTrackerUI, setShowTrackerUI] = useState(true);
  const [slideIndex, setSlideIndex]     = useState(0);
  const [participantUuid, setParticipantUuid] = useState(null);
  const sessionId = '123456'; // replace with route param or context

  // 1️⃣ Join session on mount
  useEffect(() => {
    async function join() {
      try {
        const res = await fetch('/api/sessions/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionCode: sessionId,
            name: 'Laila Oreoluwa'
          })
        });
        const { participantUuid: uuid } = await res.json();
        setParticipantUuid(uuid);

        // then join socket room
        socket.emit('joinSession', { sessionId, role: 'student' });
        socket.on('slideChange', ({ slideIndex }) => {
          setSlideIndex(slideIndex);
        });
      } catch (err) {
        console.error('Join session failed', err);
      }
    }
    join();
    return () => { socket.off('slideChange'); };
  }, [sessionId]);

  // 2️⃣ Leave session handler
  const leaveSession = async () => {
    if (!participantUuid) return;
    await fetch(`/api/sessions/${sessionId}/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participantUuid })
    });
    // redirect or cleanup...
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="bg-white rounded-b-md shadow p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Histology of the Gallbladder</h1>
          <p className="text-sm text-gray-500">June 12th, 2025 | 11:00 AM</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium">Laila Oreoluwa</p>
            <p className="text-sm text-red-600">Inattentive</p>
          </div>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
            9 points
          </span>
          <img
            src="https://randomuser.me/api/portraits/women/1.jpg"
            alt="Laila Oreoluwa"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 p-6 flex flex-col items-center relative">
        {/* PDF Viewer or placeholder */}
        <div className="w-full max-w-4xl h-[600px] overflow-auto mb-6">
          {/* Replace with a PDF.js viewer switching pages by slideIndex 
          {/*  <img
            src={HeroSection}
            alt={`Slide ${slideIndex + 1}`}
            csName="w-full h-full object-contain"
          />las
        </div>

       Leave */}
       
    <PDFSlideViewer file={samplePDF} slideIndex={slideIndex} />
  </div>
        <button
          onClick={leaveSession}
          className="bg-red-500 text-white w-full font-semibold px-6 py-5 rounded shadow hover:bg-red-600 mb-6"
        >
          Leave session
        </button>

        {/* Focus Tracker */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setShowTrackerUI(!showTrackerUI)}
            className="mb-2 p-2 bg-white border rounded-full shadow hover:bg-gray-100"
            title={showTrackerUI ? 'Hide Camera' : 'Show Camera'}
          >
            {showTrackerUI ? <EyeOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
          </button>
          {showTrackerUI && participantUuid && (
            <FastFocusTracker
              sessionId={sessionId}
              studentUUID={participantUuid}
              slideIndex={slideIndex}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-500 border-t">
        &copy; 2025 LectureLens. All rights reserved.{' '}
        <a href="#" className="underline">Privacy Policy</a> &amp;{' '}
        <a href="#" className="underline">Terms of Service</a>
      </footer>
    </div>
  );
}
