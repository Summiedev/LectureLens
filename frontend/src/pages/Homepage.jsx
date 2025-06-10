import Navbar from "../components/navigation/navbar.jsx";
import { SessionBtn } from "../components/btns.jsx";
import { BadgeCheck } from "lucide-react";
const HomePage = () => {
  return (
    <div className="bg-neutral-10 bg-[url('/src/assets/background.png')] bg-cover bg-center bg-no-repeat min-h-screen">
      <Navbar />
      <div className="w-full flex flex-col justify-center md:justify-start items-center md:items-start px-4 md:px-20 pt-10 md:pt-20 relative">
        <HomePageContents />
      </div>
    </div>
  );
};

const HomePageContents = () => {
  return (
    <div className="w-full  min-w-[100%] flex flex-col">
      <div className="flex flex-col justify-center min-h-[50vh] gap-4 md:gap-6 w-full md:w-8/10 px-3 py-1.5">
        {/* Badge text */}
        <p className="text-primary-blue-40 text-xs sm:text-sm md:text-base lg:text-lg font-medium">
          Used By 2000+ CyberSecurity Enthusiasts
        </p>

        {/* Main headline */}
        <h1 className="bg-gradient-to-bl from-primary-blue-40 to-primary-blue-60 bg-clip-text text-transparent text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold leading-tight md:leading-[1.1] lg:leading-[1.15] font-display">
          Real-time Attention Tracking for Smarter Virtual Classes
        </h1>

        {/* Subtitle */}
        <h3 className="text-primary-blue-40 text-justify md:text-left text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl leading-relaxed md:leading-[1.3] lg:leading-[1.35]">
          <span className="font-bold">Know when students lose focus,</span>{" "}
          Track their attention, deliver real-time quizzes and helps you teach
          smarter - all in one seamless layer for your online classes.
        </h3>
        <div className="flex gap-3 w-full flex-wrap">
          <SessionBtn
            role="Teacher"
            className="bg-secondary-80 hover:ring-secondary-80/60 w-full"
          />
          <SessionBtn
            role="Student"
            className="bg-primary-orange-80 hover:ring-primary-orange-80/60 w-full"
          />
        </div>
      </div>

      {/* Trust tags - positioned at top right from md screens */}
      <div className="flex flex-col justify-center max-w-[300px] px-4 py-2 md:absolute md:top-0 md:right-0 md:max-w-[350px] md:mt-5">
        {trustList.map((content) => (
          <TrustTag content={content} key={content} />
        ))}
      </div>
    </div>
  );
};

const TrustTag = ({ content }) => {
  return (
    <div className="flex gap-2 items-center mb-2">
      <BadgeCheck className="h-7 w-7 text-primary-20" />
      <p className="text-primary-20 text-sm sm:text-sm md:text-base lg:text-lg font-medium">
        {content}
      </p>
    </div>
  );
};

const trustList = ["Trusted by educators worldwide", "Hands-on Experience"];

export default HomePage;
