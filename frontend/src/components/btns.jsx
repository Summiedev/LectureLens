import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// This is a customizable btn for create or join a session
// className prop must include bg-${colour} hover:ring-${colour}/60
export const SessionBtn = ({ role, className, to }) => {
  return (
    <Link
      to={to || (role === "Teacher" ? "/teacher-dashboard" : "/Join")}
      role="button"
      className={`flex flex-col sm:max-w-[200px] h-[76px] justify-center rounded-lg px-5 py-2.5 transition-all duration-200 ring-4 cursor-pointer ${className}`}
    >
      <p className={`text-sm self-start text-neutral-10/80`}>{role}</p>
      <p className="flex gap-1">
        {role === "Teacher" ? "Create session" : "Join session"}
        <span>
          <ChevronRight />
        </span>
      </p>
    </Link>
  );
};
// used in the HomePage file
