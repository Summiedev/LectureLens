import { useEffect, useState } from "react";
import PagePreview from "../components/pagePreview";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGet } from "../hooks/api";
import { useAuthContext } from "../context/auth-context";
import { Document, Page } from "react-pdf";
import { Skeleton } from "@/components/ui/skeleton";
import SessionHeader from "../components/sessionHeader";

const TeacherView = () => {
  const navigate = useNavigate();
  const { token } = useAuthContext();
  const { session_id: sessionId } = useParams();
  const { loading, error, getData } = useGet();
  const [sessionData, setSessionData] = useState(null);
  const [numPages, setNumpages] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { session } = await getData(`/sessions/${sessionId}`, token);
        console.log(session);
        setSessionData(session);
      } catch (error) {
        console.error("Error fetching session data:", error);
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
    console.log(pdf);
    const { numPages } = pdf?._pdfInfo;
    setNumpages(numPages);
    setCurrentPage((p) => Math.min(Math.max(1, p), numPages));
  };

  const storage_path =
    "https://noebaxzcqhhsnzzlclqg.supabase.co/storage/v1/object/public/sessionfiles/1754466322623_37rfywb7ph8.pdf";
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
          <div className="bg-neutral-10 rounded-md shadow-sm/1 relative flex min-h-0">
            <Document
              file={sessionData?.slides?.storage_path}
              onLoadSuccess={onLoadSuccess}
              loading={
                <Skeleton className="flex-1 min-h-0 w-full overflow-hidden grid place-items-center rounded-md" />
              }
              className="flex-1 min-h-0 w-full overflow-hidden rounded-md grid place-items-center "
            >
              <Page
                pageNumber={currentPage}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                className="
                  size-full grid place-items-center rounded-md
                  [&_canvas]:max-w-full [&_canvas]:max-h-full
                  [&_canvas]:w-auto [&_canvas]:h-auto
                  [&_canvas]:object-contain [&_canvas]:block
                  [&_canvas]:m-auto
                "
              />
            </Document>

            <div className="h-10 cursor-pointer ring-2 ring-warning-50/50 absolute text-neutral-10 bg-warning-50 rounded-sm w-[70%] flex justify-center items-center bottom-2 left-1/2 -translate-x-1/2 text-xs md:text-sm lg:text-md font-semibold px-3 py-1">
              End Session
            </div>
          </div>
        )}

        <div className="bg-red-50 row-span-2 hidden shadow-sm/1 md:block rounded-md"></div>
        {/* slides breakdown */}
        <div className="rounded-md shadow-sm/1 min-h-50 bg-neutral-10 p-3 gap-3 relative px-14 grid grid-cols-1 grid-rows-1 items-center">
          <div className="absolute inset-0 flex justify-between items-center p-2 ">
            <button
              type="button"
              aria-label="Previous"
              onClick={() =>
                setCurrentPage((prev) => {
                  return prev - 1 === 0 ? numPages : prev - 1;
                })
              }
              className="shrink-0 inline-flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 size-9 md:size-10 cursor-pointer"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => {
                setCurrentPage((prev) => {
                  return prev + 1 > numPages ? 1 : prev + 1;
                });
              }}
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
                  storage_path={sessionData?.slides?.storage_path}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </main>
  );
};

export default TeacherView;
