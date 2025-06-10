import { useState } from "react";
import Logo from "./logo";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="w-full bg-neutral-10 shadow-sm">
        <div className="flex justify-between items-center p-2 sm:p-4 h-[70px]">
          <Logo />
          <div className="hidden md:flex items-center gap-3">
            <button className="text-primary-blue-40 border-0 rounded-sm hover:bg-primary-blue-40 hover:text-neutral-10 transition-colors duration-200 px-3 py-1.5 hover:shadow-sm">
              Login
            </button>
            <button className="border-0 bg-primary-blue-40 shadow-sm rounded-md px-3 py-1.5 text-white hover:bg-primary-blue-50 transition-colors duration-200">
              SignUp
            </button>
          </div>
          {/* Menu for navbar toggle */}
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
        </div>

        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-48 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-4 py-3 space-y-2 bg-neutral-10 border-t border-neutral-30">
            <button className="w-full text-primary-blue-40 border border-primary-blue-40 rounded-md hover:bg-primary-blue-40 hover:text-neutral-10 transition-colors duration-200 px-3 py-2">
              Login
            </button>
            <button className="w-full bg-primary-blue-40 shadow-sm rounded-md px-3 py-2 text-white hover:bg-primary-blue-50 transition-colors duration-200">
              SignUp
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
