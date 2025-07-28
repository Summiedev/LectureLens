import { useEffect } from "react";
import { useAuthContext } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
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
