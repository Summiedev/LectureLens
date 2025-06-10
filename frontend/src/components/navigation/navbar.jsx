const NavBar = () => {
  return (
    <>
      <div className="w-full flex justify-between items-center p-4 h-[50px] bg-neutral-10">
        <p className="text-black font-bold">LectureLens</p>
        <div className="flex items-center">
          <button className="text-primary-blue-40 border-0 rounded-sm hover:bg-primary-blue-40 hover:text-neutral-10 transition-colors duration-200 px-3 py-1.5">
            Login
          </button>
          <button className="border bg-primary-blue-40 rounded-md px-3 py-1.5">
            SignUp
          </button>
        </div>
      </div>
    </>
  );
};
export default NavBar;
