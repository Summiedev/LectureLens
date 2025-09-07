import NavBar from "../components/navigation/navbar.jsx";
import Footer from "../components/footer.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import { useState } from "react";
import { useAuthContext } from "../context/auth-context.jsx";
import { usePost } from "../hooks/api.js";
import { Link } from "react-router-dom";
import { ButtonLoader } from "../components/loader.jsx";
import { useAppContext } from "../context/state.jsx";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { loading, error, postData } = usePost();
  const { loginHandler } = useAuthContext();

  const { addMessage, updateMessage } = useAppContext();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async () => {
    const msgId = new Date().getTime();
    try {
      if (!formData.email || !formData.password) {
        addMessage({
          id: new Date().getTime(),
          state: "rejected",
          message: "Email and password are required.",
        });
        return;
      }

      addMessage({
        id: msgId,
        state: "loading",
        message: "Logging in...",
      });
      const result = await postData("/auth/login", {
        email: formData.email.trim(),
        password: formData.password.trim(),
      });
      const session = result?.session;
      const user = result?.teacher;
      if (!session || !user) {
        throw new Error("Invalid response from server");
      }
      loginHandler(session);
      updateMessage(msgId, {
        state: "fulfilled",
        message: "Login successful!",
      });
    } catch (err) {
      updateMessage(msgId, {
        state: "rejected",
        message: err.message ?? "An error occurred during login.",
      });
    }
  };

  return (
    <>
      <div className="bg-neutral-10 bg-[url('/src/assets/background.png')] bg-cover bg-center bg-no-repeat min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 w-full flex justify-center items-center px-4 mt-10">
          <div className="bg-neutral-10 shadow-lg rounded-lg p-6 max-w-md w-full">
            <div className="flex flex-col justify-center items-center text-center gap-1 mb-6">
              <h1 className="font-semibold text-xl text-neutral-100 max-w-[350px]">
                Welcome Back To LectureLens
              </h1>
              <p className="text-xs text-neutral-70 max-w-[300px]">
                Login to continue accessing attention insights of virtual
                classes
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form
              className="w-full flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleFormSubmit();
              }}
            >
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-neutral-90"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john.doe@example.com"
                  className="w-full border border-neutral-30 text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-blue-40 transition-all duration-200"
                  required
                  disabled={loading}
                />
              </div>

              <PasswordInput
                id="password"
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                disabled={loading}
                required
              />

              <p className="text-neutral-40 self-end text-sm cursor-pointer hover:text-primary-blue-40">
                Forgot Password?
              </p>

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-lg p-3 font-medium transition-colors duration-200 mt-2 flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-neutral-40 text-neutral-70 cursor-not-allowed"
                    : "bg-primary-blue-40 text-white hover:bg-primary-blue-50 cursor-pointer"
                }`}
              >
                {loading ? (
                  <>
                    <ButtonLoader variant="dots" size="sm" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </form>

            {/* Additional links */}
            <div className="text-center mt-4">
              <p className="text-sm text-neutral-70">
                Don't have an account?{" "}
                <Link
                  to="/SignUp"
                  className="text-primary-blue-40 hover:text-primary-blue-50 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Login;
