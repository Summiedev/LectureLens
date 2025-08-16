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

const socket = io("http://localhost:5000");

const TeacherView = () => {
  const navigate = useNavigate();
  const { token } = useAuthContext();
  const { session_id: sessionId } = useParams();
  const { loading, error, getData } = useGet();
  const { error: postError, postData } = usePost();
  const [sessionData, setSessionData] = useState(null);
  const [numPages, setNumpages] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCopied, setIsCopied] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [height, setHeight] = useState(window.innerHeight * 0.64);

  const { addMessage, updateMessage } = useAppContext();
  const hideTimerRef = useRef(null);
  const isCoarsePointer =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(pointer: coarse)").matches
      : false;

  useEffect(() => {
    socket.emit("slideChange", {
      sessionId: sessionId,
      slideIndex: currentPage,
    });
    return () => {
      socket.off("slideChange");
    };
  }, [currentPage]);

  // fetch data on component mount and start session
  useEffect(() => {
    const fetchData = async () => {
      const msgId = new Date().getTime();
      try {
        addMessage({
          id: msgId,
          state: "loading",
          message: "Starting session...",
        });
        const { session } = await getData(`/sessions/${sessionId}`, token);
        await postData(
          `/sessions/${sessionId}/start`,
          { timestamp: Date.now() },
          token
        );
        updateMessage(msgId, {
          state: "fulfilled",
          message: "Session started successfully",
        });
        setSessionData(session);
      } catch (error) {
        updateMessage(msgId, {
          state: "rejected",
          message: "Error starting session",
        });
      }
    };
    fetchData();
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
    setCurrentPage((prev) => (prev - 1 === 0 ? numPages : prev - 1));
  }, [numPages]);

  const goNext = useCallback(() => {
    if (!numPages) return;
    setCurrentPage((prev) => (prev + 1 > numPages ? 1 : prev + 1));
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

  return (
    <main className="bg-neutral-30 min-h-screen  flex flex-col pb-3">
      {/* NavBar \ Header */}
      <SessionHeader
        loading={loading}
        sessionData={sessionData}
        sessionId={sessionId}
        isCopied={isCopied}
        handleCopy={handleCopy}
      />
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[80%_20%] grid-rows-[65%_35%] gap-4 p-4 md:p-6 lg:p-8 min-h-[90vh] justify-center">
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
              className={`absolute bottom-1 md:bottom-3 left-1/2 -translate-x-1/2
                w-[40%]
                inline-flex items-center justify-center
                rounded-md bg-warning-50 text-neutral-10 font-semibold
                md:px-4 px-2 py-1 md:py-2 ring-2 ring-warning-50/60 shadow-sm
                transition-opacity duration-200 cursor-pointer
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

        <div className="bg-red-50 row-span-2 hidden shadow-sm/1 md:block rounded-md"></div>
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
                {Array.from({ length: numPages }, (_, index) => (
                  <PagePreview
                    key={index + 1}
                    pageNumber={index + 1}
                    current={currentPage === index + 1}
                    storage_path={sessionData?.slides?.storage_path}
                    setCurrentPage={setCurrentPage}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TeacherView;
