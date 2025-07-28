import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AttentionTracker from "./pages/StudentCamera";

import HomePage from "./pages/Homepage";
import Navbar from "./components/navigation/navbar";
import "./index.css";

import ViewPage from "./pages/StudentView";
import TeacherViewSession from "./pages/TeacherView";
import Dashboard from "./pages/TeacherDashboard";
import SignUpPage from "./pages/Sign-up";
import LoginPage from "./pages/Login";
import JoinSessionPage from "./pages/joinsession";
import AuthContextProvider from "./context/auth-context";
import { ProtectedRoute } from "./components/protected-route";

function App() {
  return (
    <>
      <Router>
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<HomePage />} exact />
            <Route path="/SignUp" element={<SignUpPage />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Join" element={<JoinSessionPage />} />
            <Route path="/Camera" element={<AttentionTracker />} />
            <Route path="/Student" element={<ViewPage />} />
            <Route
              path="/teacher-view"
              element={
                <ProtectedRoute>
                  <TeacherViewSession />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher-dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthContextProvider>
      </Router>
    </>
  );
}

export default App;
