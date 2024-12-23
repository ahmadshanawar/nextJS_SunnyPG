"use client";
import { useRouter } from "next/navigation";
import Login from "../login/page";
import Features from "./features";

export const LandingPage = () => {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4 lg:px-8">
      <div className="flex flex-wrap items-center">
        {/* Left Section: Text */}
        <div className="mt-8 w-full lg:w-2/3 mb-1 lg:mb-0">
          <div className="ml-8 max-w-3xl">
            <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl xl:text-5xl dark:text-purple-800">
              Stay in Peace,
            </h1>
            <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl xl:text-5xl dark:text-purple-800">
              Study with Ease!
            </h1>
            <p className="py-5 text-xl sm:text-xl text-[#3d3e3e]">
              Sunny Boys Hostel and PG, located opposite BBD University in Lucknow,
              offers spacious and comfortable rooms with a peaceful study
              environment. Serving since 2008, we provide all essential amenities for
              your comfortable and productive stay.
            </p>
            <div className="flex flex-col items-start sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
              <button
                onClick={() => router.push("signup")}
                className="px-6 py-3 bg-purple-800 text-xl font-bold text-white rounded-md hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
        {/* Right Section: Image */}
        <div className="hidden lg:flex w-full lg:w-1/3 lg:justify-end">
          <div className="w-full sm:w-[80%] lg:w-[90%]">
            <Login />
          </div>
        </div>
      </div>
      <Features />
      <div className="lg:hidden mt-4">
        <Login />
      </div>
      <hr className="my-5" />
      <footer className="relative footer footer-center bg-base-300 text-base-content p-4 text-center my-5">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by Sunny Boys
            Hostel & PG
          </p>
        </aside>
      </footer>
    </div>
  );
};
