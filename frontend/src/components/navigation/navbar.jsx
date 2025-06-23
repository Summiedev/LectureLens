import { useState } from "react";
import Logo from "./logo";
import { Menu, X } from "lucide-react";

const NavBar = ({ login, signUp }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="w-full bg-neutral-10 shadow-sm">
        <div className="flex justify-between items-center p-2 sm:p-4 h-[70px]">
          <Logo />
          {/* conditionally show buttons on props passed */}
          <div className="flex items-center gap-3">
            {login && <AuthButtons isOpen={isOpen} />}
            {signUp && <JoinSession />}
          </div>

          {/* Menu for navbar toggle */}
          {login && (
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md hover:bg-neutral-30 transition-colors duration-200"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-primary-blue-40" />
              ) : (
                <Menu className="h-6 w-6 text-primary-blue-40" />
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

const JoinSession = () => {
  return (
    <>
      <button className="border-2 border-primary-blue-50 px-2 py-1 sm:px-3 sm:py-1.5  md:px-5 md:py-2.5 bg-primary-blue-30/60 rounded-lg text-primary-blue-50 hover:bg-primary-blue-50 hover:text-neutral-10 transition-colors duration-200 shadow-sm">
        Join a session
      </button>
    </>
  );
};

const AuthButtons = ({ isOpen }) => {
  return (
    <>
      <div className="hidden md:flex items-center gap-3">
        <button className="text-primary-blue-40 border-0 rounded-sm hover:bg-primary-blue-40 hover:text-neutral-10 transition-colors duration-200 px-3 py-1.5 hover:shadow-sm">
         <a href="/login" className="text-white font-medium hover:text-gray-300">
            Login
            </a> 
        </button>
        <button className="border-0 bg-primary-blue-40 shadow-sm rounded-md px-3 py-1.5 text-white hover:bg-primary-blue-50 transition-colors duration-200">
          <a href="/signup" className="text-white font-medium hover:text-gray-300">
            Signup
            </a> 
        </button>
      </div>

      {/* Restyled Mobile Navigation */}
      <div
        className={`md:hidden fixed left-0 right-0 top-[70px] z-50 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-4 invisible"
        }`}
      >
        <div className="bg-white mx-4 rounded-lg shadow-lg border border-neutral-30/50 overflow-hidden">
          {/* Auth Buttons */}
          <div className="px-6 py-4 space-y-3">
            <button className="w-full text-primary-blue-40 bg-transparent border-2 border-primary-blue-40 rounded-lg hover:bg-primary-blue-40 hover:text-white transition-all duration-200 px-4 py-3 font-semibold">
              Login
            </button>
            <button className="w-full bg-gradient-to-r from-primary-blue-40 to-primary-blue-50 text-white rounded-lg hover:from-primary-blue-50 hover:to-primary-blue-60 transition-all duration-200 px-4 py-3 font-semibold shadow-md">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
