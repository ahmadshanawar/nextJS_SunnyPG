"use client";

import Profile from "./profile";
import IdUpload from "./id-upload";
import useUserStore from "@/lib/store/userStore";
import Loader from "react-js-loader";
const UserDashboard: React.FC = () => {
  const { userId } = useUserStore();
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
        <div role="status" className="flex items-center justify-center h-[70vh]">
          <Loader
            type="hourglass"
            bgColor={"#7c3ab3"}
            color={"#828282"}
            title={"Loading..."}
            size={60}
          />
        </div>
      )}
    </>
  );
};

export default UserDashboard;
