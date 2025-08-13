import Footer from "../components/footer";
import Navbar from "../components/navigation/navbar";
import { SquarePen, Plus, History } from "lucide-react";
import { Route, Routes } from "react-router-dom";
import SessionCard from "../components/sessionCard";
import CreateSessionForm from "../components/createSession";
import { Link } from "react-router-dom";
import { useGet } from "../hooks/api";
import Loader from "../components/loader";
import { useAuthContext } from "../context/auth-context";
import { useEffect, useState } from "react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-2 md:px-8 md:py-4 gap-8">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/create-session" element={<CreateSessionForm />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
const DashboardPage = () => {
  const [sessions, setSessions] = useState([]);

  const { loading, error, getData } = useGet();
  const { token } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        const data = await getData("/sessions", token);
        const { sessions } = data;
        setSessions(sessions || []);
      }
    };
    fetchData();
  }, [token]);

  const isSessionsEmpty = !sessions || sessions.length === 0;

  return (
    <>
      {isSessionsEmpty && !loading && <EmptyTeacherDashboard />}
      {isSessionsEmpty && loading && (
        <div className="w-full h-full flex items-center justify-center py-16">
          <Loader
            size="lg"
            variant="pulse"
            color="primary"
            text="Loading your sessions..."
          />
        </div>
      )}
      {!isSessionsEmpty && !loading && (
        <>
          <div className="shadow-md/-1 flex-col gap-3 bg-white w-full px-4 py-2 rounded-sm md:h-40 h-20 flex justify-center items-center">
            <div className="bg-neutral-30/50 text-black rounded-sm w-20  px-6 py-3 items-center justify-center h-15 hidden md:flex">
              <Plus size={26.5} />
            </div>
            <CreateSessionBtn />
          </div>
          <div className="bg-white shadow-md/0 rounded-md flex-col flex items-center  w-full h-full flex-1 px-6 py-3  md:px-8 md:py-4 gap-4">
            <div className="flex justify-between items-center text-black text-xs md:text-sm w-full">
              <p>Recent sessions</p>
              <button className="flex gap-2 items-center justify-center">
                Clear history <History size={21.5} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 place-items-center lg:grid-cols-3 xl:grid-cols-4 w-full gap-3 md:px-2 py-1 mt-5  justify-center md:items-start items-center">
              {sessions.map((session) => (
                <SessionCard key={session.session_id} session={session} />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

const EmptyTeacherDashboard = () => {
  return (
    <div className="flex flex-col flex-1 items-center justify-center space-y-4 bg-white rounded-md w-full h-full px-2 py-1 shadow-md/5">
      <svg
        className="w-40 h-40 text-green-200"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z"
          stroke="#A3BDAA"
          fill="none"
          strokeWidth="1"
        />
        <line
          x1="25"
          y1="50"
          x2="25"
          y2="60"
          stroke="#A3BDAA"
          strokeWidth="1"
        />
        <line
          x1="75"
          y1="50"
          x2="75"
          y2="60"
          stroke="#A3BDAA"
          strokeWidth="1"
        />
      </svg>

      <h2 className="text-gray-900 font-semibold text-lg">
        You don’t have any active session.
      </h2>
      <p className="text-gray-500 text-sm">
        Looks like you haven’t created a class session yet. Start by launching
        your first interactive session
      </p>
      <CreateSessionBtn />
    </div>
  );
};

const CreateSessionBtn = () => {
  return (
    <Link
      to={"create-session"}
      className="bg-info-50 hover:bg-blue-600 transition-colors duration-300 cursor-pointer text-white px-6 py-3 rounded-md text-sm font-medium flex justify-center items-center gap-2"
    >
      <SquarePen size={20} />
      Create a session
    </Link>
  );
};
