import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import LoginPage from "./pages/Login";
import JoinSessionPage from "./pages/joinsession";
import AuthContext from "./context/auth-context";

function App() {
  return (
    <>
      <AuthContext.Provider value={{ isLoggedIn: false }}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/SignUp" element={<SignUpPage />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Join" element={<JoinSessionPage />} />
            <Route path="/Camera" element={<AttentionTracker />} />
            <Route path="/Student" element={<ViewPage />} />
            <Route path="/Teacher-view" element={<TeacherViewSession />} />
            <Route path="/Teacher-dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </>
  );
}

export default App;
