import { useState } from "react";
import FastFocusTracker from "./StudentCamera";
import { Camera, EyeOff } from "lucide-react"; // Camera icons
import HeroSection from "../assets/presentation screen.png";

export default function ViewPage() {
  const [showTrackerUI, setShowTrackerUI] = useState(true);

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="bg-white rounded-b-md shadow p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            Histology of the Gallbladder
          </h1>
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

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col items-center relative">
        {/* Image Section */}
        <div className="w-full max-w-8xl max-h-[600px] overflow-hidden rounded shadow-lg mb-6">
          <img
            src={HeroSection}
            alt="Gallbladder histology illustration"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Leave Session Button */}
        <button className="bg-red-500 text-white w-full font-semibold px-6 py-5 rounded shadow hover:bg-red-600 mb-6">
          Leave session
        </button>

        {/* FastFocusTracker with toggle */}
        <div className="fixed bottom-4 right-4 z-50">
          {/* Toggle Button */}
          <button
            onClick={() => setShowTrackerUI(!showTrackerUI)}
            className="mb-2 p-2 bg-white border rounded-full shadow hover:bg-gray-100"
            title={showTrackerUI ? "Hide Camera" : "Show Camera"}
          >
            {showTrackerUI ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Camera className="w-5 h-5" />
            )}
          </button>

          {/* Always mounted; just visually hidden */}
          <div className={showTrackerUI ? "" : "hidden"}>
            <FastFocusTracker
              sessionId="123456"
              studentUUID="student-uuid-001"
              slideIndex={0}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-500 border-t">
        &copy; 2025 LectureLens. All rights reserved.{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>{" "}
        &amp;{" "}
        <a href="#" className="underline">
          Terms of Service
        </a>
      </footer>
    </div>
  );
}
