import NavBar from "../components/navigation/navbar.jsx";
import Footer from "../components/footer.jsx";
import PasswordInput from "../components/auth/passwordInput.jsx";
import { useEffect, useState } from "react";
import { usePost } from "../hooks/api.js";
import { useAuthContext } from "../context/auth-context.jsx";
import { ButtonLoader } from "../components/loader.jsx";
import { Link } from "react-router-dom";
const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const { loading, error, postData } = usePost();
  const { loginHandler } = useAuthContext();

  useEffect(() => {
    const validateForm = () => {
      if (formData.fullName.length === 0) return;
      if (formData.fullName && formData.fullName.length < 2) {
        setFormError("Full name too short");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        setFormError("Please enter a valid email address");
        return;
      }

      if (
        formData.password &&
        formData.confirmPassword &&
        formData.password !== formData.confirmPassword
      ) {
        setFormError("Passwords do not match");
        return false;
      }
      if (formData.password && formData.password.length < 6) {
        setFormError("Password must be at least 6 characters long");
        return false;
      }
    };
    const interval = setTimeout(() => {
      validateForm();
    }, 700);
    return () => {
      clearTimeout(interval);
    };
  }, [formData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await postData("/auth/register", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      const token = result?.token;
      const user = result?.teacher;

      loginHandler(user, token);
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div className="bg-neutral-10 bg-[url('/src/assets/background.png')] bg-cover bg-center bg-no-repeat min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 w-full flex justify-center items-center px-4 mt-10">
        <div className="bg-neutral-10 shadow-lg rounded-lg p-6 max-w-md w-full">
          <div className="flex flex-col justify-center items-center text-center gap-2 mb-6">
            <h1 className="font-semibold text-xl text-neutral-100">
              Create an account
            </h1>
            <p className="text-sm text-neutral-70">
              Let's make learning more smarter and interactive
            </p>
          </div>

          {/* Error Display */}
          {(error || formError) && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {formError || error}
            </div>
          )}

          {/* Main form */}
          <form
            className="w-full flex flex-col gap-4"
            onSubmit={handleFormSubmit}
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="fullname" className="text-sm font-medium text-neutral-90">
                Full Name
              </label>
              <input
                id="fullname"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full border border-neutral-30 text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-blue-40 transition-all duration-200"
                required
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-neutral-90">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleInputChange}
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

            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
              disabled={loading}
              required
            />

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
                  <span>Creating account...</span>
                </>
              ) : (
                "Continue"
              )}
            </button>

            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-neutral-70">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-blue-40 hover:text-primary-blue-50 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUpPage;
