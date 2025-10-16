import { useEffect } from "react";
import { useAuthContext } from "../context/auth-context";
import { useNavigate, useParams } from "react-router-dom";
export const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useAuthContext();
  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      navigate("/login");
    }
  }, [isLoggedIn, isLoading, navigate]);

  return <>{children}</>;
};

export const SessionJoin = ({ children, name, setSessionId }) => {
  const navigate = useNavigate();
  const { session_id } = useParams();
  useEffect(() => {
    if (!name) {
      setSessionId(session_id);
      navigate("/join");
    }
  }, [name, navigate]);
  return children;
};
