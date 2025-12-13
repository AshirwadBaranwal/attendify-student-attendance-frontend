import React from "react";
import { useSelector } from "react-redux";

const WelcomeCard = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <div className="relative  w-full  bg-primary rounded-lg p-8 overflow-hidden border-2 border-gray-200 shadow-sm">
      {/* Fade blocks/decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/20 rounded-full"></div>
      <div className="absolute bottom-8 left-4 w-16 h-16 bg-white/15 rounded-full blur-lg"></div>
      <div className="absolute top-16 left-8 w-8 h-8 bg-white/25 rounded-full"></div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-black/10"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Good Morning Mr. {user?.collegeAdmin?.name} !
          </h1>
          <p className="text-white/90 text-base leading-relaxed">
            Welcome back to your dashboard. We're here to <br /> help you have a
            great day.
          </p>
        </div>

        {/* Action button */}
        {/* <StylishDashButton /> */}
      </div>

      {/* Character illustration placeholder */}
      <div className="absolute bottom-0 right-4 w-32 h-32">
        <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center"></div>
        </div>
      </div>

      <img
        className="absolute top-0 h-80 right-0"
        src="/WelcomeImage.png"
        alt="Welcome"
        fetchPriority="high"
      />

      {/* Additional decorative elements */}
      <div className="absolute top-4 right-16 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
      <div className="absolute bottom-16 left-12 w-3 h-3 bg-white/30 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-24 right-8 w-1 h-1 bg-white/50 rounded-full animate-pulse delay-500"></div>
    </div>
  );
};

export default WelcomeCard;
