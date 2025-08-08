import { ArrowLeft, Copy, CopyCheck } from "lucide-react";
import { useState } from "react";
import PagePreview from "../components/pagePreview";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TeacherView = () => {
  const navigate = useNavigate();
  const storage_path =
    "https://noebaxzcqhhsnzzlclqg.supabase.co/storage/v1/object/public/sessionfiles/1754466322623_37rfywb7ph8.pdf";
  const sessionId = "u78-uy6-po9-po1";
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(sessionId);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  return (
    <main className="bg-neutral-30 min-h-screen  flex flex-col pb-3">
      {/* NavBar \ Header */}
      <div className="w-full h-20 bg-neutral-10 shadow-sm px-3 py-1.5 md:px-5 gap-4 md:py-2.5 items-center flex justify-between">
        <div className="flex items-center gap-2 md:gap-5">
          <div
            className="flex items-center justify-center rounded-full size-5 md:size-7 bg-info-50 cursor-pointer"
            onClick={() => {
              const canGoBack = (window.history.state?.idx ?? 0) > 0;
              if (canGoBack) navigate(-1);
              else navigate("/teacher-dashboard", { replace: true });
            }}
          >
            <ArrowLeft className=" size-3 md:size-5 text-neutral-10" />
          </div>
          <div className="flex flex-col  justify-center">
            <p className="font-semibold text-xs md:text-md sm:text-sm lg:text-lg line-clamp-1">
              Histology of the Gallbladder
            </p>
            <p className="text-neutral-50 text-xs md:text-sm lg:text-md line-clamp-1">
              June 16, 2025 | 12:00 AM
            </p>
          </div>
        </div>
        <div className="md:w-45 w-40 rounded-sm  h-8 md:h-10 bg-neutral-30/50 justify-between items-center px-4 py-2 text-[10px] sm:text-xs md:text-sm flex gap-1 line-clamp-1">
          <p className="line-clamp-1">{sessionId}</p>
          {!isCopied ? (
            <Copy
              className={`size-4 cursor-pointer transition-all duration-200 hover:scale-110 hover:text-info-60 ${
                isCopied ? "scale-125 text-info-70" : ""
              }`}
              onClick={handleCopy}
            />
          ) : (
            <CopyCheck className="size-4 text-green-600 animate-pulse" />
          )}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[80%_20%] grid-rows-[65%_35%] gap-4 p-4 md:p-6 lg:p-8 min-h-[90vh] justify-center">
        <div className=" bg-blue-50 rounded-md shadow-sm/1 relative">
          <div className="h-10 cursor-pointer ring-2 ring-warning-50/50 absolute text-neutral-10 bg-warning-50 rounded-sm w-[70%] flex justify-center items-center bottom-2 left-1/2 -translate-x-1/2 text-xs md:text-sm lg:text-md font-semibold px-3 py-1">
            End Session
          </div>
        </div>
        <div className="bg-red-50 row-span-2 hidden shadow-sm/1 md:block rounded-md"></div>
        {/* slides breakdown */}
        <div className="rounded-md shadow-sm/1 min-h-50 bg-neutral-10 p-3  gap-3 relative px-14">
          <div className="absolute inset-0 flex justify-between items-center p-2 ">
            <button
              type="button"
              aria-label="Previous"
              className="shrink-0 inline-flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 size-9 md:size-10"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              className="shrink-0 inline-flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 size-9 md:size-10"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          <ScrollArea className="flex-1 rounded-md">
            <div className="flex w-max gap-3 h-full">
              <PagePreview
                storage_path={storage_path}
                averageAttention={79.5}
              />
              <PagePreview storage_path={storage_path} />
              <PagePreview
                storage_path={storage_path}
                averageAttention={10.9}
              />
              <PagePreview
                storage_path={storage_path}
                averageAttention={49.9}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </main>
  );
};

export default TeacherView;
