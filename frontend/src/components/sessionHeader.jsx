import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Copy, CopyCheck } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
const formatSessionDate = (dateObj) => {
  if (!dateObj) return "No date";

  try {
    const date = new Date(dateObj);
    return format(date, "MMMM dd, yyyy | hh:mm aa");
  } catch (error) {
    return "Invalid date";
  }
};
const SessionHeader = ({
  loading,
  sessionData,
  sessionId,
  isCopied,
  handleCopy,
}) => {
  const navigate = useNavigate();
  return (
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
          {loading ? (
            <>
              <Skeleton className="h-6 w-50" />
              <Skeleton className="h-4 w-45 mt-1" />
            </>
          ) : (
            <>
              <p className="font-semibold text-xs md:text-md sm:text-sm lg:text-lg line-clamp-1 capitalize">
                {sessionData?.title || "Title"}
              </p>
              <p className="text-neutral-50 text-xs md:text-sm lg:text-md line-clamp-1">
                {formatSessionDate(sessionData?.date) ||
                  "June 16, 2025 | 12:00 AM"}
              </p>
            </>
          )}
        </div>
      </div>
      <div className="md:w-45 w-40 rounded-sm  h-8 md:h-10 bg-neutral-30/50 justify-between items-center px-4 py-2 text-[10px] sm:text-xs md:text-sm flex gap-1 line-clamp-1">
        <p className="line-clamp-1">{sessionId}</p>
        {!isCopied ? (
          <Copy
            className={`size-6 md:size-9 cursor-pointer transition-all duration-200 hover:scale-110 hover:text-info-60 ${
              isCopied ? "scale-125 text-info-70" : ""
            }`}
            onClick={handleCopy}
          />
        ) : (
          <CopyCheck className="size-6 md:size-9 text-green-600 animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default SessionHeader;
