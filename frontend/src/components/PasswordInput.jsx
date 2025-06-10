import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({ 
  id, 
  label, 
  placeholder = "••••••••", 
  required = false,
  className = "",
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        htmlFor={id}
        className="text-sm font-medium text-neutral-90"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="w-full border border-neutral-30 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-blue-40 focus:border-transparent transition-all duration-200"
          required={required}
          {...props}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-50 hover:text-neutral-70 transition-colors duration-200"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;