import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Search, GraduationCap } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const tips = [
    "Tip: Press / to focus search",
    "Remember: Take short breaks",
    "Pro tip: Review before sleep",
    "Shortcut: Ctrl + K to quick-jump",
    "Stay curious. Stay kind.",
  ];

  // Rotating study images (Unsplash, safe use)
  const images = useMemo(
    () => [
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b25saW5lJTIwbGVhcm5pbmd8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1080&auto=format&fit=crop",
    ],
    []
  );
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % images.length), 6000);
    return () => clearInterval(id);
  }, [images.length]);

  const handleBack = () => {
    const canGoBack = (window.history.state?.idx ?? 0) > 0;
    if (canGoBack) navigate(-1);
    else navigate("/", { replace: true });
  };

  return (
    <main className="relative min-h-screen bg-neutral-30 overflow-hidden flex items-center justify-center px-4">
      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -inset-40 bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.25),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(12,170,255,0.25),transparent_40%)] blur-3xl animate-aurora" />
      </div>

      {/* Sparkles */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(18)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/70 animate-sparkle"
            style={{
              width: Math.random() > 0.5 ? 3 : 2,
              height: Math.random() > 0.5 ? 3 : 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.25}s`,
              opacity: 0.3 + Math.random() * 0.6,
            }}
            aria-hidden
          />
        ))}
      </div>

      {/* Card */}
      <section className="relative z-10 w-full max-w-6xl animate-fade-in">
        <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-600/40 via-info-50/30 to-blue-600/10 shadow-sm/1">
          <div className="rounded-2xl bg-neutral-10 p-5 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Visual side */}
              <div className="relative">
                {/* Rotating image frame */}
                <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-xl border border-neutral-30/70 bg-neutral-10 shadow-sm/1 aspect-[4/3]">
                  {images.map((src, i) => {
                    const active = i === idx;
                    return (
                      <img
                        key={src}
                        src={src}
                        alt="Study scene"
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out
                          ${
                            active
                              ? "opacity-100 scale-100"
                              : "opacity-0 scale-105"
                          }`}
                        draggable={false}
                      />
                    );
                  })}

                  {/* Floating chips */}
                  <span className="absolute left-3 top-3 text-[10px] md:text-xs px-2 py-1 rounded-full bg-blue-600 text-white shadow-sm animate-parallax">
                    Biology
                  </span>
                  <span
                    className="absolute right-3 top-4 text-[10px] md:text-xs px-2 py-1 rounded-full bg-info-50 text-neutral-900 shadow-sm animate-parallax"
                    style={{ animationDelay: "0.6s" }}
                  >
                    Math
                  </span>
                  <span
                    className="absolute left-4 bottom-4 text-[10px] md:text-xs px-2 py-1 rounded-full bg-neutral-20/90 border border-neutral-30/70 shadow-sm animate-parallax"
                    style={{ animationDelay: "1s" }}
                  >
                    History
                  </span>

                  {/* Orbit overlay */}
                  <div className="pointer-events-none absolute inset-0 animate-orbit-container">
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-3 rounded-full bg-info-50 animate-orbit-1" />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rounded-full bg-blue-600/80 opacity-80 animate-orbit-2" />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-1.5 rounded-full bg-blue-600/60 opacity-60 animate-orbit-3" />
                  </div>

                  {/* Dots indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-neutral-10/70 backdrop-blur-sm rounded-full px-2 py-1 border border-neutral-30/70">
                    {images.map((_, i) => (
                      <span
                        key={i}
                        className={`size-1.5 rounded-full transition-all ${
                          i === idx ? "bg-blue-600 size-2" : "bg-neutral-40"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Faux search with shimmer */}
                <div className="mt-6 max-w-md mx-auto">
                  <div className="relative flex items-center gap-2 rounded-full border border-neutral-30/70 bg-neutral-10 px-4 py-2.5 overflow-hidden">
                    <Search className="size-4 text-blue-600" />
                    <div className="relative flex-1 h-4 rounded-full bg-neutral-30/50 overflow-hidden">
                      <div className="absolute inset-0 shimmer-bg animate-shine-sweep" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content side */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-30/70 bg-neutral-10 text-neutral-700 mb-3">
                  <GraduationCap className="size-4 text-blue-600" />
                  <span className="text-xs">LectureLens</span>
                </div>

                {/* Clear 404 headline */}
                <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-1">
                  <span className="bg-gradient-to-r from-blue-600 to-info-50 bg-clip-text text-transparent">
                    404
                  </span>
                </h1>
                <p className="text-2xl md:text-3xl font-semibold mb-2">
                  Lost in learning?
                </p>
                <p className="text-neutral-70 text-sm md:text-base">
                  The page you’re after moved or never existed. Try going back,
                  head home, or join a session.
                </p>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap items-center gap-3 justify-center md:justify-start">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-4 py-2 md:px-5 md:py-2.5 hover:bg-blue-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                  >
                    <Home className="size-4" />
                    Go home
                  </button>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-30/70 bg-neutral-10 px-4 py-2 md:px-5 md:py-2.5 text-neutral-900 hover:bg-neutral-20/50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                  >
                    <ArrowLeft className="size-4" />
                    Go back
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/Join")}
                    className="inline-flex items-center gap-2 rounded-full border border-blue-600/30 text-blue-700 bg-blue-50 px-4 py-2 md:px-5 md:py-2.5 hover:bg-blue-100 transition"
                  >
                    Join session
                  </button>
                </div>

                {/* Tips marquee */}
                <div className="mt-6 relative overflow-hidden rounded-full border border-neutral-30/70 bg-neutral-10">
                  <div className="whitespace-nowrap flex gap-8 py-2 px-4 animate-marquee">
                    {tips.concat(tips).map((t, i) => (
                      <span key={i} className="text-xs text-neutral-600">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom glow */}
                <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-blue-600/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
