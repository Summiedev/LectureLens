import { useEffect, useState, useRef, useCallback } from "react";
import PagePreview from "../components/pagePreview";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGet, usePost } from "../hooks/api";
import { useAuthContext } from "../context/auth-context";
import { Document, Page } from "react-pdf";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppContext } from "../context/state";
import SessionHeader from "../components/sessionHeader";
import { io } from "socket.io-client";
import Loader from "../components/loader";
import AppMsg from "../components/appMsg";

const socket = io("http://localhost:5000");
const height = window.innerHeight * 0.64;
const TeacherView = () => {
  const navigate = useNavigate();
  const { token } = useAuthContext();
  const { session_id: sessionId } = useParams();
  const { loading, error, getData } = useGet();
  const { postData } = usePost();
  const [sessionData, setSessionData] = useState(null);
  const [numPages, setNumpages] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [avgAttentionByPage, setAvgAttentionByPage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prevPage, setPrevPage] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [student, setStudent] = useState([]);
  const [joinMsg, setJoinMsg] = useState(null);
  const scrollRef = useRef(null);

  const { addMessage, updateMessage } = useAppContext();
  const hideTimerRef = useRef(null);
  const isCoarsePointer =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(pointer: coarse)").matches
      : false;

  useEffect(() => {
    socket.on("pageAverageAttention", ({ page, avgAttention }) => {
      setAvgAttentionByPage((prev) => {
        const i = prev.findIndex((p) => p.page === page);
        if (i === -1) return [...prev, { page, avgAttention }];
        const copy = prev.slice();
        copy[i] = { page, avgAttention };
        return copy;
      });
      socket.on("sessionEnded", () => {
        console.log("Recieved Event");
        setIsLoading(false);
        navigate("/teacher-dashboard");
      });
    });
    socket.on("newParticipant", ({ participantUuid, name }) => {
      setStudent((prev) => {
        const index = prev.findIndex(
          (p) => p.participantUuid === participantUuid
        );
        if (index === -1)
          return [...prev, { participantUuid, name, attention: 0 }];

        const copy = prev.slice();
        copy[index] = { participantUuid, name, attention: 0 };
        return copy;
      });
      setJoinMsg({
        message: `${name} joined the session`,
        state: "fulfilled",
      });
    });
    socket.on(
      "participantAttentionChange",
      ({ participantUuid, attention }) => {
        setStudent((prev) => {
          const index = prev.findIndex(
            (p) => p.participantUuid === participantUuid
          );
          if (index === -1) return prev;
          const copy = prev.slice();
          copy[index] = { ...copy[index], attention };
          return copy;
        });
      }
    );
    socket.on("participantLeft", ({ participantUuid, name }) => {
      setStudent((prev) => {
        const index = prev.findIndex(
          (p) => p.participantUuid === participantUuid
        );
        if (index === -1) return prev;
        const copy = prev.slice();
        copy.splice(index, 1);
        return copy;
      });
      setJoinMsg({
        message: `${name} left the session`,
        state: "fulfilled",
      });
    });
    return () => {
      socket.off("pageAverageAttention");
      socket.off("sessionEnded");
      socket.off("newParticipant");
      socket.off("participantAttentionChange");
      socket.off("participantLeft");
    };
  }, []);

  useEffect(() => {
    socket.emit("slideChange", {
      sessionId: sessionId,
      slideIndex: currentPage,
      previousSlideIndex: prevPage,
    });
    const raf = requestAnimationFrame(() => {
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    });
    return () => {
      cancelAnimationFrame(raf);
      socket.off("slideChange");
    };
  }, [currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      const msgId = new Date().getTime();
      try {
        const { session } = await getData(`/sessions/${sessionId}`, token);
        if (!session.started_at) {
          addMessage({
            id: msgId,
            state: "loading",
            message: "Starting session...",
          });
          await postData(
            `/sessions/${sessionId}/start`,
            { timestamp: Date.now() },
            token
          );
          updateMessage(msgId, {
            state: "fulfilled",
            message: "Session started successfully",
          });
        }
        const { current_page } = session;
        setCurrentPage(current_page ?? 1);
        setPrevPage(current_page - 1);
        setAvgAttentionByPage(session?.avg_attention_logs ?? []);
        const participants = session?.participants.filter((p) => !p.left_at);
        setStudent(participants);

        setSessionData(session);
      } catch (error) {
        updateMessage(msgId, {
          state: "rejected",
          message: "Error starting session",
        });
      }
    };
    fetchData();
    socket.emit("joinSession", {
      sessionId: sessionId,
      role: "teacher",
    });
    return () => {
      socket.off("joinSession");
    };
  }, [token]);
  const handleCopy = () => {
    navigator.clipboard.writeText(sessionId);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const onLoadSuccess = (pdf) => {
    const { numPages } = pdf?._pdfInfo;
    setNumpages(numPages);
    setCurrentPage((p) => Math.min(Math.max(1, p), numPages));
  };
  const revealControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setShowControls(false), 2500);
  }, []);

  // change height dynamically
  useEffect(() => {
    revealControlsTemporarily();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [window.innerHeight]);

  // Go to previous/next page (wrap around)
  const goPrev = useCallback(() => {
    if (!numPages) return;
    setCurrentPage((prev) => {
      const newPage = prev - 1 === 0 ? numPages : prev - 1;
      setPrevPage(prev);
      return newPage;
    });
  }, [numPages]);

  const goNext = useCallback(() => {
    if (!numPages) return;
    setCurrentPage((prev) => {
      const newPage = prev + 1 > numPages ? 1 : prev + 1;
      setPrevPage(prev);
      return newPage;
    });
  }, [numPages]);

  // Keyboard navigation: ArrowLeft / ArrowRight
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);
  const handleEndSession = () => {
    setIsLoading(true);
    socket.emit("endSession", { sessionId });
  };
  return (
    <main className="bg-neutral-30 min-h-screen  flex flex-col pb-3">
      {joinMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex justify-center items-center px-2 py-1">
          <AppMsg
            message={joinMsg.message}
            state={joinMsg.state}
            autoHideDelay={3000}
            onClose={() => setJoinMsg(null)}
          />
        </div>
      )}
      {/* NavBar \ Header */}
      <SessionHeader
        loading={loading}
        sessionData={sessionData}
        sessionId={sessionId}
        isCopied={isCopied}
        handleCopy={handleCopy}
      />
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[75%_25%] grid-rows-[65%_35%] gap-4 p-4 md:p-6 lg:p-8 min-h-[90vh] justify-center">
        {isLoading && (
          <div className="absolute inset-0 flex justify-center z-50 items-center w-full h-full bg-neutral-70/50">
            <Loader
              variant="pulse"
              text="Ending Session..."
              textColor="text-neutral-10"
            />
          </div>
        )}
        {loading ? (
          <Skeleton />
        ) : (
          <div
            className="bg-neutral-10 rounded-md shadow-sm/1 relative flex min-h-0  group"
            onMouseEnter={() => !isCoarsePointer && setShowControls(true)}
            onMouseLeave={() => !isCoarsePointer && setShowControls(false)}
            onTouchStart={revealControlsTemporarily}
          >
            <Document
              file={sessionData?.slides?.storage_path}
              onLoadSuccess={onLoadSuccess}
              loading={
                <Skeleton className="flex-1 min-h-[80%] w-full overflow-hidden grid place-items-center rounded-md" />
              }
              className="flex-1 min-h-0 w-full overflow-hidden rounded-md grid place-items-center "
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

            <p
              className={`text-xs md:text-sm lg:text-base font-medium text-neutral-10 absolute md:bottom-3 bottom-1 right-1 md:right-3 px-2 py-0.5 md:px-2.5 md:py-1.5 rounded-full bg-neutral-950/70 shadow-sm backdrop-blur
                transition-opacity duration-200
                ${
                  showControls ? "opacity-100" : "opacity-0 pointer-events-none"
                }
                group-hover:opacity-100 group-hover:pointer-events-auto`}
            >
              Page {currentPage} of {numPages ?? 0}
            </p>

            <div
              className={`absolute inset-0 w-full h-full flex justify-between p-1 md:p-3 items-center
                transition-opacity duration-200
                ${
                  showControls ? "opacity-100" : "opacity-0 pointer-events-none"
                }
                group-hover:opacity-100 group-hover:pointer-events-auto`}
            >
              <button
                type="button"
                aria-label="Previous"
                disabled={!numPages}
                onClick={goPrev}
                className={`shrink-0 inline-flex items-center justify-center rounded-full
                  bg-neutral-950/70 text-white hover:bg-neutral-900/80 z-50 cursor-pointer
                  shadow-md backdrop-blur
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600
                  size-9 md:size-10 transition transform active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next"
                disabled={!numPages}
                onClick={goNext}
                className={`shrink-0 inline-flex items-center justify-center rounded-full
                  bg-neutral-950/70 text-white hover:bg-neutral-900/80
                  shadow-md backdrop-blur z-50 cursor-pointer
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600
                  size-9 md:size-10 transition transform active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            <button
              type="button"
              aria-hidden={!showControls}
              onClick={handleEndSession}
              className={`absolute bottom-1 md:bottom-3 left-1/2 -translate-x-1/2
                w-[40%] cursor-pointer z-50
                inline-flex items-center justify-center
                rounded-md bg-warning-50 text-neutral-10 font-semibold
                md:px-4 px-2 py-1 md:py-2 ring-2 ring-warning-50/60 shadow-sm
                transition-opacity duration-200
                hover:brightness-95 active:scale-95
                ${
                  showControls ? "opacity-100" : "opacity-0 pointer-events-none"
                }
                group-hover:opacity-100 group-hover:pointer-events-auto text-sm md:text-base`}
            >
              End Session
            </button>
          </div>
        )}

        <div className="bg-red-50 items-center gap-3 p-2 row-span-2 hidden shadow-sm/1  rounded-md md:flex flex-col">
          <div className="px-4 bg-neutral-70 text-neutral-10 rounded-md w-full h-9 flex justify-center items-center py-2">
            Students
          </div>
          <div className="w-full h-full flex flex-col gap-3">
            {student.map((partcipant) => (
              <StudentProfile
                key={
                  partcipant.participantUuid ?? `${Date.now()}-${Math.random()}`
                }
                name={partcipant.name}
                attention={partcipant.attention}
              />
            ))}
          </div>
        </div>
        {/* slides breakdown */}
        <div className="rounded-md shadow-sm/1 min-h-50 grid grid-cols-1 grid-rows-1 items-center">
          <div className="rounded-md shadow-sm/1 min-h-50  p-3 gap-3 relative px-14 grid grid-cols-1 grid-rows-1 items-center bg-neutral-10">
            <div className="absolute inset-0 flex justify-between items-center p-2 ">
              <button
                type="button"
                aria-label="Previous"
                onClick={goPrev}
                className="shrink-0 inline-flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 size-9 md:size-10 cursor-pointer"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={goNext}
                className="shrink-0 inline-flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 size-9 md:size-10 cursor-pointer"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            <ScrollArea className="flex-1 rounded-md">
              <div className="flex w-max gap-3 h-full">
                {Array.from({ length: numPages }, (_, index) => {
                  const avgAttention = avgAttentionByPage.find(
                    (page) => page.page === index + 1
                  )?.avgAttention;

                  return (
                    <div
                      key={index + 1}
                      ref={index + 1 === currentPage ? scrollRef : null}
                      className="shrink-0"
                    >
                      <PagePreview
                        pageNumber={index + 1}
                        averageAttention={avgAttention ?? undefined}
                        current={currentPage === index + 1}
                        storage_path={sessionData?.slides?.storage_path}
                        setCurrentPage={setCurrentPage}
                        setPrevPage={setPrevPage}
                      />
                    </div>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </main>
  );
};

const StudentProfile = ({ name, attention }) => {
  return (
    <div className="text-sm flex items-center whitespace-nowrap gap-1 px-2 py-1 max-h-5">
      <span className="size-6 bg-info-50 rounded-full"></span>
      <span className="text-medium truncate">{name}</span> |
      <span
        className={`font-semibold text-sm px-2 py-0.5 rounded-full ${
          attention >= 50
            ? " text-green-700"
            : attention >= 10
            ? " text-yellow-700"
            : " text-red-700"
        }`}
      >
        {attention ?? 0}%
      </span>
    </div>
  );
};

export default TeacherView;
