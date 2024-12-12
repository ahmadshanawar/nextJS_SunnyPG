"use client";
import Login from "../login/page";
import Features from "./features";

export const LandingPage = () => {
  return (
    <div className="container mx-auto px-4 lg:px-8">
      <div className="flex flex-wrap items-center">
        {/* Left Section: Text */}
        <div className="w-full lg:w-2/3 mb-1 lg:mb-0">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl xl:text-5xl dark:text-purple-800">
              Stay in Peace,
            </h1>
            <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl xl:text-5xl dark:text-purple-800">
              Study with Ease!
            </h1>
            <p className="py-5 text-xl sm:text-xl text-[#3d3e3e]">
              Sunny Boys Hostel and PG, located opposite BBD University in Lucknow,
              offers spacious and comfortable rooms with a peaceful environment.
              Serving students since 2008, we provide all essential amenities for a
              comfortable and productive stay.
            </p>
            <div className="flex flex-col items-start sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
              <button className="px-6 py-3 bg-purple-800 text-xl font-bold text-white rounded-md hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-blue-300">
                Book Now
              </button>
            </div>
          </div>
        </div>
        {/* Right Section: Image */}
        <div className="w-full lg:w-1/3 flex lg:justify-end">
          <div className="w-full sm:w-[80%] lg:w-[90%]">
            <Login />
          </div>
        </div>
      </div>
      <Features />
    </div>
  );
};
