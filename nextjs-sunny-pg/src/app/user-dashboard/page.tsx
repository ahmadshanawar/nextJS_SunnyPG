"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Profile from "./profile";
import { useRouter } from "next/navigation";
import { checkForSession } from "@/lib/sessions";
import IdUpload from "./id-upload";
import useUserStore from "@/lib/store/userStore";

const UserDashboard: React.FC = () => {
  const router = useRouter();
  const { status, setUserId, userId } = useUserStore();
  const checkSession = async () => {
    let res = await checkForSession();
    if (!res) {
      router.push("/");
    }
    setUserId(res?.user?.id);
  };
  useEffect(() => {
    if (!userId) checkSession();
  }, []);

  return (
    <>
      {userId ? (
        <div className="flex flex-col md:flex-row h-auto gap-4 md:gap-0 mt-2">
          {/* Left Section */}
          <div className="w-full md:w-3/5 flex justify-center">
            <div className="bg-white shadow-2xl rounded-lg md:p-12 w-[98%] md:w-[98%]">
              <Profile />
              <IdUpload />
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-2/5 flex justify-center">
            {status === "Active" && (
              <div className="bg-white shadow-2xl rounded-lg p-8 w-[98%] md:w-[98%]">
                <h2 className="text-xl md:text-2xl font-bold mb-4">
                  Right Section Card
                </h2>
                <p className="text-gray-600">
                  This is the content of the right section. Add more components or
                  text here as needed.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-10">
          <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
            <svg
              className="w-16 h-16 animate-spin text-gray-900/50"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
            >
              <path
                d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-900"
              ></path>
            </svg>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDashboard;
