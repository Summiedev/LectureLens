import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AttentionTracker from "./pages/StudentCamera";
import HomePage from "./pages/Homepage";
import { useEffect, useState } from "react";
import "./index.css";
import AppMsg from "./components/appMsg";
import ViewPage from "./pages/StudentView";
import TeacherViewSession from "./pages/TeacherView";
import Dashboard from "./pages/TeacherDashboard";
import SignUpPage from "./pages/Sign-up";
import LoginPage from "./pages/Login";
import JoinSessionPage from "./pages/joinsession";
import AuthContextProvider from "./context/auth-context";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/protected-route";
import { useAppContext } from "./context/state";
import { SessionJoin } from "./components/protected-route";

import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

function App() {
  const { messages, removeMessage } = useAppContext();
  const [name, setName] = useState("");
  useEffect(() => {
    localStorage.setItem("studentName", name);
  }, [name]);
  const [sessionId, setSessionId] = useState("");
  return (
    <>
      <div className="fixed top-4 right-4 z-[1000] flex flex-col gap-2 items-end">
        {messages.map((m) => (
          <AppMsg
            key={m.id}
            message={m.message}
            state={m.state}
            onClose={() => removeMessage(m.id)}
          />
        ))}
      </div>
      <Router>
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<HomePage />} exact />
            <Route path="/SignUp" element={<SignUpPage />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route
              path="/Join"
              element={
                <JoinSessionPage
                  setName={setName}
                  name={name}
                  session_id={sessionId}
                />
              }
            />
            <Route path="/Camera" element={<AttentionTracker />} />
            {/* <Route path="/Student" element={<ViewPage />} /> */}
            <Route
              path="/Student/:session_id"
              element={
                <SessionJoin name={name} setSessionId={setSessionId}>
                  <ViewPage name={name} setName={setName} />
                </SessionJoin>
              }
            />
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
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthContextProvider>
      </Router>
    </>
  );
}

export default App;
