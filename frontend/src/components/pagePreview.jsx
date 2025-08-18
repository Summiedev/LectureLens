import { Document, Page } from "react-pdf";
import { Skeleton } from "@/components/ui/skeleton";

const PagePreview = ({
  pageNumber = 1,
  storage_path,
  averageAttention = undefined,
  setCurrentPage,
  setPrevPage,
  current,
}) => {
  return (
    <>
      <main
        aria-current={current ? "page" : undefined}
        className={`flex flex-col w-full h-35 md:h-full rounded-md border shadow-sm/1 relative rounded-t-md gap-3 min-h-0 max-w-70 max-h-45 cursor-pointer transition
          ${
            current
              ? "border-info-50 ring-2 ring-info-50 shadow-md bg-info-50/10"
              : "border-neutral-30/50 bg-neutral-10/10"
          }`}
        onClick={() => {
          setCurrentPage(pageNumber);
          setPrevPage(pageNumber - 1 === 0 ? 1 : pageNumber - 1);
        }}
      >
        <p className="size-4 rounded-full text-sm m-1 text-neutral-10 absolute p-3 z-50 bg-black/30 flex justify-center items-center">
          {pageNumber}
        </p>
        <div className="absolute md:hidden inset-0 bg-black/40 z-10 rounded-md"></div>
        <Document
          file={storage_path}
          loading={
            <Skeleton className="flex-1 min-h-0 w-full overflow-hidden grid place-items-center rounded-md" />
          }
          className={`flex-1 min-h-30 w-full overflow-hidden grid place-items-center rounded-md md:rounded-t-md md:rounded-b-none
            ${
              averageAttention
                ? averageAttention > 60
                  ? "ring-green-400"
                  : "ring-red-400"
                : "ring-info-50"
            } ring-1`}
        >
          <Page
            className={`rounded-md
              [&_canvas]:max-w-full [&_canvas]:max-h-full
              [&_canvas]:w-auto [&_canvas]:h-auto
              [&_canvas]:object-contain md:rounded-t-md
              [&_canvas]:rounded-md
              `}
            pageNumber={pageNumber}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>

        <div className="flex items-center gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 md:top-0 md:static md:left-0 md:-translate-x-0 z-50 md:px-2 md:pb-2">
          <div
            className={`size-6 rounded-sm  ${
              averageAttention
                ? averageAttention > 60
                  ? "bg-green-600"
                  : "bg-red-600"
                : "border-info-50 border"
            }`}
          />
          <div className="flex flex-col text-sm text-black">
            <span className="text-neutral-70 text-xs md:block hidden">
              Average attention
            </span>
            <p
              className={`font-bold ${
                averageAttention
                  ? averageAttention > 60
                    ? "text-green-400"
                    : "text-red-500"
                  : "hidden"
              }`}
            >
              {averageAttention
                ? parseFloat(averageAttention.toFixed(2))
                : undefined}
              %
            </p>
          </div>
        </div>
      </main>
    </>
  );
};
export default PagePreview;
