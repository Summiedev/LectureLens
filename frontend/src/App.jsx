import { BrowserRouter as Router, Route, Routes, Form } from "react-router-dom";
import AttentionTracker from "./pages/StudentCamera";

import HomePage from "./pages/Homepage";
import Navbar from "./components/navigation/navbar";
import PageForm from "./components/form/form";
import "./index.css";

// import React, { useEffect } from "react";
// import { useLocation } from "react-router-dom";
import ViewPage from "./pages/StudentView";
import TeacherViewSession from "./pages/TeacherView";
import Dashboard from "./pages/TeacherDashboard";
import SignUpPage from "./pages/Sign-up";
import JoinSessionPage from "./pages/joinsession";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/SignUp" element={<SignUpPage />} />
          <Route path="/Join" element={<JoinSessionPage />} />
          <Route path="/Camera" element={<AttentionTracker />} />
          <Route path="/Student" element={<ViewPage />} />
          <Route path="/Teacher-view" element={<TeacherViewSession />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
