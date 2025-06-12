import NavBar from "../components/navigation/navbar.jsx";
import Footer from "../components/footer.jsx";
import PasswordInput from "../components/auth/passwordInput.jsx";
import { useState } from "react";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

          {/* Main form */}
          <form
            className="w-full flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              console.log(formData);
            }}
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="fullname"
                className="text-sm font-medium text-neutral-90"
              >
                Full Name
              </label>
              <input
                id="fullname"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full border text-black rounded-lg p-3 focus:outline-none focus:ring-2 transition-all duration-200 `}
                required
              />
            </div>

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
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full border text-black rounded-lg p-3 focus:outline-none focus:ring-2 transition-all duration-200`}
                required
              />
            </div>

            <PasswordInput
              id="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />

            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />

            <button
              type="submit"
              className={`w-full rounded-lg p-3 font-medium transition-colors duration-200 mt-2 bg-primary-blue-40 cursor-pointer`}
            >
              Continue
            </button>
          </form>

          {/* Additional links */}
          <div className="text-center mt-4">
            <p className="text-sm text-neutral-70">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-primary-blue-40 hover:text-primary-blue-50 font-medium"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUpPage;
