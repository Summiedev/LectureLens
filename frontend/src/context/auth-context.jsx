import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext({
  isLoggedIn: false,
  token: "",
});

const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState({});

  const navigate = useNavigate();

  const loginHandler = useCallback(
    (user, token) => {
      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setIsLoggedIn(true);
      navigate("/Teacher-Dashboard");
    },
    [navigate]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && token) {
      setUser(user);
      setToken(token);
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, loginHandler, token, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthContextProvider;
