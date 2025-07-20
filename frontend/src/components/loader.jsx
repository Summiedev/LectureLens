import React from "react";

// Main Loader Component with sophisticated animations
const Loader = ({
  size = "md",
  color = "primary",
  text = "",
  fullScreen = false,
  className = "",
  variant = "orbit",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const colorClasses = {
    primary: "border-primary-blue-40",
    secondary: "border-secondary-80",
    orange: "border-primary-orange-80",
    neutral: "border-neutral-70",
  };

  const LoaderContent = () => {
    switch (variant) {
      case "orbit":
        return <OrbitLoader size={size} color={color} />;
      case "pulse":
        return <PulseRingLoader size={size} color={color} />;
      case "helix":
        return <HelixLoader size={size} color={color} />;
      case "morphing":
        return <MorphingLoader size={size} color={color} />;
      default:
        return <OrbitLoader size={size} color={color} />;
    }
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-neutral-10/90 backdrop-blur-md flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-6">
          <LoaderContent />
          {text && (
            <p className="text-neutral-90 text-lg font-medium animate-fade-in-up">
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <LoaderContent />
        {text && (
          <p className="text-neutral-70 text-sm font-medium animate-fade-in">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

// Sophisticated Orbit Loader
const OrbitLoader = ({ size, color }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const dotSizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
    xl: "w-5 h-5",
  };

  const colorClasses = {
    primary: "bg-primary-blue-40",
    secondary: "bg-secondary-80",
    orange: "bg-primary-orange-80",
    neutral: "bg-neutral-70",
  };

  return (
    <div className={`${sizeClasses[size]} relative animate-orbit-container`}>
      {/* Center dot */}
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${dotSizes[size]} ${colorClasses[color]} rounded-full opacity-40`}
      />

      {/* Orbiting dots */}
      <div
        className={`${dotSizes[size]} ${colorClasses[color]} rounded-full absolute animate-orbit-1`}
      />
      <div
        className={`${dotSizes[size]} ${colorClasses[color]} rounded-full absolute animate-orbit-2 opacity-75`}
      />
      <div
        className={`${dotSizes[size]} ${colorClasses[color]} rounded-full absolute animate-orbit-3 opacity-50`}
      />
    </div>
  );
};

// Pulse Ring Loader
const PulseRingLoader = ({ size, color }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const colorClasses = {
    primary: "border-primary-blue-40",
    secondary: "border-secondary-80",
    orange: "border-primary-orange-80",
    neutral: "border-neutral-70",
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <div
        className={`absolute inset-0 ${colorClasses[color]} border-2 rounded-full animate-pulse-ring-1`}
      />
      <div
        className={`absolute inset-0 ${colorClasses[color]} border-2 rounded-full animate-pulse-ring-2`}
      />
      <div
        className={`absolute inset-0 ${colorClasses[color]} border-2 rounded-full animate-pulse-ring-3`}
      />
    </div>
  );
};

// Helix DNA-like Loader
const HelixLoader = ({ size, color }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const colorClasses = {
    primary: "bg-primary-blue-40",
    secondary: "bg-secondary-80",
    orange: "bg-primary-orange-80",
    neutral: "bg-neutral-70",
  };

  return (
    <div className={`${sizeClasses[size]} relative animate-helix-container`}>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-1 h-1 ${colorClasses[color]} rounded-full animate-helix-strand`}
          style={{
            animationDelay: `${i * 0.125}s`,
            transform: `rotate(${i * 45}deg) translateY(-${
              size === "sm"
                ? "12px"
                : size === "md"
                ? "18px"
                : size === "lg"
                ? "24px"
                : "30px"
            })`,
          }}
        />
      ))}
    </div>
  );
};

// Morphing Shape Loader
const MorphingLoader = ({ size, color }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const colorClasses = {
    primary: "bg-primary-blue-40",
    secondary: "bg-secondary-80",
    orange: "bg-primary-orange-80",
    neutral: "bg-neutral-70",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} animate-morph-shape`}
    />
  );
};

// Sophisticated Button Loader
export const ButtonLoader = ({
  size = "md",
  className = "",
  variant = "dots",
}) => {
  const Variants = {
    dots: <ButtonDotsLoader size={size} />,
    wave: <ButtonWaveLoader size={size} />,
    spinner: <ButtonSpinnerLoader size={size} />,
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {Variants[variant]}
    </div>
  );
};

const ButtonDotsLoader = ({ size }) => {
  const dotSizes = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2",
  };

  return (
    <div className="flex items-center space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${dotSizes[size]} bg-white rounded-full animate-button-dots`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
};

const ButtonWaveLoader = ({ size }) => {
  const barSizes = {
    sm: "w-0.5 h-3",
    md: "w-0.5 h-4",
    lg: "w-1 h-5",
  };

  return (
    <div className="flex items-center space-x-1">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`${barSizes[size]} bg-white rounded-full animate-button-wave`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
};

const ButtonSpinnerLoader = ({ size }) => {
  const spinnerSizes = {
    sm: "w-3 h-3 border",
    md: "w-4 h-4 border-2",
    lg: "w-5 h-5 border-2",
  };

  return (
    <div
      className={`${spinnerSizes[size]} border-white/20 border-t-white rounded-full animate-sophisticated-spin`}
    />
  );
};

// Advanced Card Skeleton with shimmer effect
export const CardSkeleton = ({ className = "" }) => {
  return (
    <div
      className={`bg-neutral-10 rounded-lg p-6 shadow-lg overflow-hidden relative ${className}`}
    >
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-neutral-30 rounded-lg shimmer-bg" />
        <div className="h-3 bg-neutral-30 rounded-lg w-3/4 shimmer-bg" />
        <div className="space-y-2">
          <div className="h-3 bg-neutral-30 rounded-lg shimmer-bg" />
          <div className="h-3 bg-neutral-30 rounded-lg w-5/6 shimmer-bg" />
        </div>
      </div>

      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
};

// Sophisticated Page Loader with floating elements
export const PageLoader = ({ text = "Loading LectureLens..." }) => {
  return (
    <div className="fixed inset-0 bg-neutral-10 bg-[url('/src/assets/background.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-32 h-32 border border-primary-blue-40/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="text-primary-blue-40 text-3xl font-bold animate-logo-pulse">
          LectureLens
        </div>

        <div className="flex flex-col items-center gap-6">
          <OrbitLoader size="xl" color="primary" />
          <p className="text-neutral-90 text-lg font-medium animate-fade-in-up">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};

// Advanced Progress Loader with gradient and glow
export const ProgressLoader = ({ progress = 0, className = "" }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="relative bg-neutral-30 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-primary-blue-40 via-primary-blue-50 to-primary-blue-60 transition-all duration-500 ease-out relative overflow-hidden"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-progress-shine" />
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-neutral-70 font-medium">
          {Math.round(progress)}%
        </p>
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 bg-primary-blue-40 rounded-full animate-progress-dots"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loader;
