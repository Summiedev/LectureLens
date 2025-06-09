import '../../index.css';
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
function PasswordInput(){
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-[var(--black-100)] text-sm font-semibold mb-2">Password</label>
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="********"
                    className="bg-white border border-[var(--gray-100)] text-[var(--black-200)] rounded-md p-2 pr-10 placeholder:text-[var(--gray-50)] focus:bg-[#F6F6F6] w-full"
                />
                <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--gray-200)]"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
        </div>
    );
}
export default PasswordInput;