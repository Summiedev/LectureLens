import Logo from "./navigation/logo.jsx";
const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <Logo />
      </div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search sessions"
          className="px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img src="/user-avatar.jpg" alt="User avatar" />
        </div>
        <span className="text-sm text-gray-700">Ore Parker</span>
      </div>
    </header>
  );
};
export default Header;
