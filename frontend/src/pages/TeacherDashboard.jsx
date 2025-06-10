import React from "react";
import { Camera, EyeOff } from "lucide-react"; // Camera icons
import Footer from "../components/footer";
import Header from "../components/header";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header/>
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Placeholder icon */}
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
            Looks like you haven’t created a class session yet. Start by launching your first interactive session
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium">
            Create a session
          </button>
        </div>
      </main>

      {/* Footer */}
     <Footer />
    </div>
  );
}
