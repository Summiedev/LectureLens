import { ChevronRight } from "lucide-react";

// This is a customizable btn for create or join a session
// className prop must include bg-${colour} hover:ring-${colour}/60
export const SessionBtn = ({ role, className }) => {
  return (
    <button
      className={`flex flex-col sm:max-w-[200px] h-[76px] justify-center rounded-lg px-5 py-2.5 transition-all duration-200 ring-4 cursor-pointer ${className}`}
    >
      <p className={`text-sm self-start text-neutral-10/80`}>{role}</p>
      <p className="flex gap-1">
        {role === "Teacher" ? "Create session" : "Join session"}
        <span>
          <ChevronRight />
        </span>
      </p>
    </button>
  );
};
// used in the HomePage file
