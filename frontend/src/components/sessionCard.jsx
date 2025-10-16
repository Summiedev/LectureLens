import { Document, Page } from "react-pdf";
import { format } from "date-fns";
import { Link } from "react-router-dom";
const formatSessionDate = (dateObj) => {
  if (!dateObj) return "No date";

  try {
    const date = new Date(dateObj);
    return format(date, "MMMM dd, yyyy | hh:mm aa");
  } catch (error) {
    return "Invalid date";
  }
};
const SessionCard = ({ session }) => {
  const { started_at, ended_at, avg_attention_logs } = session;
  const attention =
    avg_attention_logs.length > 0
      ? avg_attention_logs.reduce(
          (acc, num) => acc + parseFloat(num.avg_attention),
          0
        ) / avg_attention_logs.length
      : 0;
  const avgAttention =
    ended_at && started_at
      ? parseInt(attention)
      : started_at && !ended_at
      ? "Ongoing"
      : undefined;
  return (
    <>
      <main className="rounded-md shadow-sm/1 border min-h-65 border-neutral-30/50 w-full max-w-80 relative">
        <Link
          to={`/session/${session?.session_id}`}
          className="absolute inset-0 z-50 text-transparent cursor-pointer w-full h-full"
        ></Link>
        <Document file={session?.slides?.storage_path} className="w-full h-40 ">
          <Page
            className={`w-full h-38 object-cover rounded-t-md flex justify-center items-center ${
              avgAttention
                ? avgAttention > 40
                  ? "border-green-600/50"
                  : "border-red-600/50"
                : "border-neutral-50"
            } border
              
              [&_canvas]:max-w-full [&_canvas]:max-h-full
              [&_canvas]:!w-full [&_canvas]:!h-full
              [&_canvas]:object-contain [&_canvas]:block
            `}
            pageNumber={1}
            height={158}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
        <div className="flex flex-col p-2 gap-2">
          <div className="flex flex-col items-start">
            <h3 className="text-sm font-semibold text-black capitalize">
              {session?.title}
            </h3>
            <p className="text-xs text-gray-500">
              {formatSessionDate(session?.date)}
            </p>
          </div>
          <div className="border-[0.2px] border-neutral-30/50 w-full"></div>
          <div className="flex gap-1 items-center">
            <div
              className={`size-6 rounded-sm ${
                avgAttention
                  ? avgAttention > 40
                    ? "bg-green-600"
                    : "bg-red-600"
                  : "bg-neutral-50"
              }`}
            ></div>
            <div className="flex flex-col text-sm text-black items-start">
              <span className="text-neutral-70">Average attention</span>
              <p
                className={`font-bold ${
                  avgAttention
                    ? avgAttention > 40
                      ? "text-green-600"
                      : "text-red-600"
                    : "text-neutral-50"
                }`}
              >
                {`${avgAttention ? `${avgAttention}%` : "Not Started"}`}
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SessionCard;
