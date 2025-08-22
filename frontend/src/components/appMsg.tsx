import { useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export type AppMsgState = "loading" | "fulfilled" | "rejected";

export interface AppMsgProps {
  message?: string;
  state?: AppMsgState;
  autoHideDelay?: number;
  onClose?: () => void;
}

const AppMsg = ({
  message = "",
  state = "loading",
  autoHideDelay = 2000,
  onClose,
}: AppMsgProps) => {
  const [closing, setClosing] = useState(false);
  const [removed, setRemoved] = useState(false);

  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset on state/message change, and trigger auto-hide for fulfilled/rejected
  useEffect(() => {
    setClosing(false);
    setRemoved(false);

    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (removeTimer.current) clearTimeout(removeTimer.current);

    if (state === "fulfilled" || state === "rejected") {
      hideTimer.current = setTimeout(() => setClosing(true), autoHideDelay);
    }

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (removeTimer.current) clearTimeout(removeTimer.current);
    };
  }, [state, message, autoHideDelay]);

  // After fade-out, remove from DOM and notify
  useEffect(() => {
    if (!closing) return;

    removeTimer.current = setTimeout(() => {
      setRemoved(true);
      onClose?.();
    }, 320); // match CSS transition duration

    return () => {
      if (removeTimer.current) clearTimeout(removeTimer.current);
    };
  }, [closing, onClose]);

  if (removed) return null;

  const isLoading = state === "loading";
  const isSuccess = state === "fulfilled";
  const isError = state === "rejected";

  const colorClasses = isLoading
    ? "bg-blue-50/90 border-blue-200 text-blue-900"
    : isSuccess
    ? "bg-green-50/90 border-green-200 text-green-900"
    : "bg-red-50/90 border-red-200 text-red-900";

  const Icon = isLoading ? Loader2 : isSuccess ? CheckCircle2 : XCircle;

  return (
    <div
      data-state={state}
      className={`pointer-events-auto shadow-md rounded-md border shadow-sm/1 px-3 py-2 flex items-center gap-2 max-w-[90vw] sm:max-w-md
        ${colorClasses}
        transition-all duration-300 ease-out
        ${closing ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"}`}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      aria-busy={isLoading ? "true" : "false"}
    >
      <Icon
        className={`shrink-0 size-5 ${isLoading ? "animate-spin" : ""}`}
        aria-hidden="true"
      />
      <p className="text-sm leading-snug">{message}</p>
    </div>
  );
};

export default AppMsg;
