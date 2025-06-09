import Logo from "./logo";
import ButtonNo from "./buttonnobg";
import ButtonBg from "./buttonbg";
import ButtonOut from "./buttonout";

function Navbar() {
    return (
        <nav className="bg-white w-[90%] mx-auto shadow">
            <div className="flex items-center justify-between px-6 py-3 h-16">
                <Logo />
                <ul className="flex gap-4">
                    <ButtonNo buttonText="Login" />
                    <ButtonBg buttonText="Sign Up" />
                    <ButtonOut buttonText="Join a Session" />
                </ul>
            </div>
        </nav>
    );
}
export default Navbar;