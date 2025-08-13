import NavBar from "../components/navigation/navbar";
import Footer from "../components/footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const JoinSessionPage = () => {
  const [sessionId, setSessionId] = useState("");
  const navigate = useNavigate();
  const joinSession = () => {
    navigate(`/student/${sessionId}`);
  };
  return (
    <div className="bg-neutral-10 bg-[url('/src/assets/background.png')] bg-cover bg-center bg-no-repeat min-h-screen text-black">
      <NavBar />
      <div className="flex justify-center items-center h-full w-full min-h-[80vh]">
        <div className="w-[400px] rounded-lg bg-primary-blue-20/80 shadow-lg min-h-32 p-8   flex flex-col justify-center gap-4">
          <div className="w-full flex flex-col justify-center bg-secondary-70 px-3 py-1.5 rounded-md gap-0 ring-2 ring-secondary-70/60">
            <span className="text-neutral-10/80 text-sm">Student</span>
            <span className="text-neutral-10 font-semibold text-md">
              Join Session
            </span>
          </div>
          <div className="flex flex-col  justify-center w-full">
            <label
              htmlFor="session-id"
              className="text-md font-semibold mb-1 text-black"
            >
              Enter Session Code
            </label>
            <input
              type="text"
              id="session-id"
              value={sessionId}
              onChange={(e) => {
                setSessionId(e.target.value);
              }}
              placeholder="Enter Session Code"
              className="border border-neutral-30 bg-neutral-10 rounded-md px-3 py-2 mb-3"
            />
          </div>
          <button
            className="w-full bg-primary-blue-40 text-neutral-10 font-semibold py-2 rounded-md cursor-pointer hover:bg-primary-blue-50 transition-colors duration-200"
            onClick={joinSession}
          >
            Join a session
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default JoinSessionPage;
