import {
  createContext,
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/db";
const AuthContext = createContext({
  isLoggedIn: false,
  token: "",
});

const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") {
        const access = session?.access_token || "";
        const refresh = session?.refresh_token || "";
        setToken(access);
        setRefreshToken(refresh);
        setUser(session?.user ?? null);
        setIsLoggedIn(!!access);
        localStorage.setItem("session", JSON.stringify(session)); // persist fresh tokens
      }
      // Optional: keep user in sync if metadata changes
      if (event === "USER_UPDATED") {
        setUser(session?.user ?? null);
      }
      if (event === "SIGNED_OUT") {
        setToken("");
        setRefreshToken("");
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem("session");
        localStorage.removeItem("user");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data: supa } = await supabase.auth.getSession();
        let active = supa?.session;

        if (!active) {
          const stored = JSON.parse(localStorage.getItem("session") || "null");
          if (stored?.access_token && stored?.refresh_token) {
            const { data, error } = await supabase.auth.setSession({
              access_token: stored.access_token,
              refresh_token: stored.refresh_token,
            });
            if (error) throw error;
            active = data?.session ?? null;
          }
        }

        if (active) {
          setUser(active.user ?? null);
          setToken(active.access_token || "");
          setRefreshToken(active.refresh_token || "");
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error restoring session:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const loginHandler = useCallback(
    async (session) => {
      try {
        const { data, error } = await supabase.auth.setSession(session);
        if (error) throw error;
        const user = data?.user;
        setToken(data.session?.access_token);
        setRefreshToken(data.session?.refresh_token);
        localStorage.setItem("session", JSON.stringify(data.session));
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        setIsLoggedIn(true);
        navigate("/teacher-dashboard");
      } catch (error) {
        console.error(error);
      }
    },
    [navigate]
  );
  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      navigate("/", { replace: true });
    } catch (e) {
      console.error("Sign out failed:", e);
    }
  }, [navigate]);
  const value = useMemo(
    () => ({
      isLoggedIn,
      loginHandler,
      token,
      user,
      isLoading,
      logout,
    }),
    [isLoggedIn, loginHandler, token, user, isLoading, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthContextProvider;
