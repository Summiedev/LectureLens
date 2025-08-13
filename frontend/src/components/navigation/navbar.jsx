import { useState, memo } from "react";
import Logo from "./logo";
import { Menu, X } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useAuthContext } from "../../context/auth-context";
import { Search, ChevronDown, User, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn } = useAuthContext();
  const { pathname } = useLocation();
  const pathName = pathname.toLowerCase();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="w-full bg-neutral-10 shadow-sm">
        <div className="flex justify-between items-center p-2 sm:p-4 h-[70px]">
          <Link to="/" className="">
            <Logo />
          </Link>

          {/* conditionally show buttons on props passed */}
          <div className="flex items-center gap-3">
            {pathName === "/" && !isLoggedIn && <AuthButtons isOpen={isOpen} />}

            {(pathName === "/" || pathName.startsWith("/teacher-dashboard")) &&
              isLoggedIn && <UserBar />}

            {(pathName === "/signup" || pathName === "/login") && (
              <JoinSession />
            )}

            {pathName === "/join" && (
              <Link
                to="/"
                className="text-primary-blue-40 hover:text-primary-blue-50"
              >
                Back to Home
              </Link>
            )}
          </div>
          {pathName === "/" && (
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

const UserBar = () => {
  const { user, logout } = useAuthContext();
  return (
    <DropdownMenu>
      <div className="hidden md:flex items-center  text-black">
        <Search className="ml-2 text-neutral-30 absolute size-5" />
        <input
          type="text"
          placeholder="Search sessions"
          className="px-4 pl-8 py-2  bg-neutral-30/30 text-black rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-300 hidden md:block"
        />
      </div>

      <div className="w-8 h-8 rounded-full overflow-hidden">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s"
          alt="User avatar"
        />
      </div>
      <DropdownMenuTrigger className="text-sm text-gray-700 capitalize flex gap-1 justify-center items-center">
        {user?.name}
        <ChevronDown className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 pt-2 mt-2">
        <DropdownMenuItem className="flex items-center gap-2">
          <User />
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2">
          <Settings />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} className="p-0">
          <div className="flex items-center gap-2 w-full h-full p-2 rounded-sm  bg-warning-50 text-neutral-10 hover:bg-warning-50/80 cursor-pointer">
            <LogOut className="text-neutral-10 hover:text-black" />
            Logout
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const JoinSession = () => {
  return (
    <>
      <Link
        to="/Join"
        role="button"
        className="border-0 block sm:border-2 sm:border-primary-blue-50 px-2 py-1 sm:px-3 sm:py-1.5  md:px-5 md:py-2.5 bg-none sm:bg-primary-blue-30/60 rounded-lg text-primary-blue-50 hover:bg-primary-blue-50 hover:text-neutral-10 transition-colors duration-200 sm:shadow-sm"
      >
        Join a session
      </Link>
    </>
  );
};

const AuthButtons = ({ isOpen }) => {
  return (
    <>
      <div className="hidden md:flex items-center gap-3">
        <Link
          to="/login"
          className="text-primary-blue-40 border-0 rounded-sm hover:bg-primary-blue-40 hover:text-neutral-10 transition-colors duration-200 px-3 py-1.5 hover:shadow-sm"
        >
          Login
        </Link>
        <Link
          to="/SignUp"
          className="border-0 bg-primary-blue-40 shadow-sm rounded-md px-3 py-1.5 text-white hover:bg-primary-blue-50 transition-colors duration-200 block text-center"
          role="button"
        >
          SignUp
        </Link>
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
            <Link
              to="/SignUp"
              className="w-full bg-gradient-to-r from-primary-blue-40 to-primary-blue-50 text-white rounded-lg hover:from-primary-blue-50 hover:to-primary-blue-60 transition-all duration-200 px-4 py-3 font-semibold shadow-md block text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(NavBar);
