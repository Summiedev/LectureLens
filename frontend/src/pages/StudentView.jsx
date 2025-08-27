import { useState, useEffect } from "react";
import FastFocusTracker from "./StudentCamera";
import { useAuthContext } from "../context/auth-context";
import { useGet, usePost } from "../hooks/api";
import { Camera, EyeOff } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Document, Page } from "react-pdf";
import { useAppContext } from "../context/state";
import { Skeleton } from "@/components/ui/skeleton";
import Loader from "../components/loader";
import { io } from "socket.io-client";

const formatSessionDate = (dateObj) => {
  if (!dateObj) return "No date";
  try {
    const date = new Date(dateObj);
    return format(date, "MMMM dd, yyyy | hh:mm aa");
  } catch (error) {
    return "Invalid date";
  }
};

const height = window.innerHeight * 0.64;
const socket = io("http://localhost:5000");

export default function StudentViewPage({ name, setName }) {
  const { token } = useAuthContext();
  const navigate = useNavigate();
  const { loading, getData } = useGet();
  const { postData } = usePost();
  const [showTrackerUI, setShowTrackerUI] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [participantUuid, setParticipantUuid] = useState(undefined);
  const [info, setInfo] = useState(null);
  const { addMessage } = useAppContext();
  const [sessionData, setSessionData] = useState(null);
  const { session_id: sessionId } = useParams();
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("studentName");
    if (name) setName(name);
  }, []);

  // fetch session data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { session } = await getData(`/sessions/${sessionId}`);
        const { started_at, ended_at } = session;
        if (!started_at) {
          addMessage({
            state: "rejected",
            id: Date.now(),
            message: "Session has not started yet.",
          });
          setInfo("Session has not started yet.");
          return;
        }
        if (ended_at) {
          addMessage({
            state: "rejected",
            id: Date.now(),
            message: "Session has already ended.",
          });
          setInfo("Session has already ended.");
          return;
        }
        setSessionData(session);
        const { current_page } = session;
        setCurrentPage(current_page);
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };
    if (sessionId) fetchData();
  }, [token, sessionId]);

  const onLoadSuccess = (pdf) => {
    const { numPages } = pdf?._pdfInfo;
    setCurrentPage((p) => Math.min(Math.max(1, p), numPages));
  };
  useEffect(() => {
    const onSlideChange = ({ slideIndex }) => setCurrentPage(slideIndex);

    const onSessionEnded = () => {
      if (participantUuid) {
        socket.emit("leaveSession", { sessionId, participantUuid });
      }
      setInfo("Session has ended.");
    };

    const onParticipantLeft = ({ participantUuid: participantId }) => {
      if (participantId === participantUuid) {
        addMessage({
          id: Date.now(),
          message: "Session left successfully",
          state: "fulfilled",
        });
        setIsLeaving(false);
        navigate("/");
      }
    };

    socket.on("slideChange", onSlideChange);
    socket.on("sessionEnded", onSessionEnded);
    socket.on("participantLeft", onParticipantLeft);

    return () => {
      socket.off("slideChange", onSlideChange);
      socket.off("sessionEnded", onSessionEnded);
      socket.off("participantLeft", onParticipantLeft);
    };
  }, [sessionId, participantUuid, navigate, addMessage]);

  useEffect(() => {
    async function join() {
      try {
        const { participantUuid: uuid } = await postData("/sessions/join", {
          sessionCode: sessionId,
          name,
        });
        setParticipantUuid(uuid);
        socket.emit("joinSession", {
          sessionId,
          role: "student",
          name,
          participantUuid: uuid,
        });
      } catch (err) {
        console.error("Join session failed", err);
      }
    }
    if (sessionData) join();
    return () => {
      socket.off("joinSession");
    };
  }, [sessionId, name]);

  // 2️⃣ Leave session handler
  const leaveSession = async () => {
    if (!participantUuid) return;
    setIsLeaving(true);
    socket.emit("leaveSession", { sessionId, participantUuid, name });
  };

  return (
    <>
      <div className="min-h-screen flex flex-col p-2 md:p-4 bg-gray-100 text-gray-900 gap-3">
        {/* Header */}
        <header className="bg-white rounded-md shadow-md/1 p-4 flex items-center justify-between">
          <div>
            {loading ? (
              <>
                <Skeleton className="h-6 w-50" />
                <Skeleton className="h-4 w-45 mt-1" />
              </>
            ) : (
              <>
                <h1 className="text-xl font-semibold capitalize">
                  {sessionData?.title ?? "Title"}
                </h1>
                <p className="text-sm text-gray-500">
                  {formatSessionDate(sessionData?.date) ??
                    "June 16, 2025 | 12:00 AM"}
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <img
              src="https://randomuser.me/api/portraits/women/1.jpg"
              alt="Laila Oreoluwa"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-right flex gap-2 rounded-sm px-4 py-2 bg-neutral-30/15 items-center justify-evenly h-10">
              <p className="font-medium">{name}</p>
              <span className="w-[2px] h-full border-1 bg-neutral-70"></span>
              <span className="text-green-500 text-sm">9 points</span>
              <span className="w-[2px] h-full border-1 bg-neutral-70"></span>
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="bg-red-600 size-4 rounded-full"></span>
                Inattentive
              </p>
            </div>
          </div>
        </header>
        {/* Slide viewer */}
        <div className="shadow-md/1 bg-neutral-30/30 rounded-sm w-full min-w-[50%] min-h-50vh h-[70vh] md:min-h-[50%] overflow-hidden relative flex items-center justify-center">
          {isLeaving && (
            <div className="absolute inset-0 flex justify-center z-50 items-center w-full h-full bg-neutral-70/50">
              <Loader
                variant="pulse"
                text="Leaving Session..."
                textColor="text-neutral-10"
              />
            </div>
          )}
          {info && (
            <div className="absolute inset-0  w-full h-full bg-neutral-70/40 flex items-center justify-center text-2xl capitalize text-neutral-10">
              {info}
            </div>
          )}
          {!info &&
            (loading ? (
              <Skeleton className=" w-full h-90 bg-neutral-50" />
            ) : (
              <Document
                file={sessionData?.slides?.storage_path}
                onLoadSuccess={onLoadSuccess}
                loading={
                  <Skeleton className="flex-1 w-full h-full overflow-hidden grid place-items-center rounded-md" />
                }
                className="flex-1 w-full h-full overflow-hidden grid place-items-center"
              >
                <Page
                  pageNumber={currentPage}
                  renderAnnotationLayer={true}
                  renderTextLayer={true}
                  className="
                  grid place-items-center rounded-md
                  [&_canvas]:max-w-full [&_canvas]:max-h-full
                  [&_canvas]:!w-auto [&_canvas]:!h-auto
                  [&_canvas]:object-contain [&_canvas]:block
                  [&_canvas]:m-auto
                "
                  height={height}
                />
              </Document>
            ))}
        </div>

        {/* Main */}
        <main className="flex-1 px-4 py-2 flex flex-col items-center relative gap-2">
          <button
            onClick={leaveSession}
            className="bg-warning-50 text-white w-1/2 font-semibold px-4 py-2 ring-3 ring-warning-50/50 rounded shadow hover:bg-warning-50/80 cursor-pointer  mb-6"
          >
            Leave session
          </button>
        </main>
        <div className="fixed bottom-4 right-4 z-50">
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
          {showTrackerUI && (
            <FastFocusTracker
              sessionId={sessionId}
              studentUUID={participantUuid}
              slideIndex={currentPage}
              active={sessionData}
              socket={socket}
            />
          )}
        </div>
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
    </>
  );
}
