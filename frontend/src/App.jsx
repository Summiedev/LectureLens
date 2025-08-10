import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AttentionTracker from "./pages/StudentCamera";
import HomePage from "./pages/Homepage";

import "./index.css";

import ViewPage from "./pages/StudentView";
import TeacherViewSession from "./pages/TeacherView";
import Dashboard from "./pages/TeacherDashboard";
import SignUpPage from "./pages/Sign-up";
import LoginPage from "./pages/Login";
import JoinSessionPage from "./pages/joinsession";
import AuthContextProvider from "./context/auth-context";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/protected-route";

import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

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
              path="/session/:session_id"
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
            />{" "}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthContextProvider>
      </Router>
    </>
  );
}

export default App;
