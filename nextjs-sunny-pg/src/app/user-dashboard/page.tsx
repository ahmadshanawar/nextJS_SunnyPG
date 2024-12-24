"use client";

import Profile from "./profile";
import IdUpload from "./id-upload";
import useUserStore from "@/lib/store/userStore";
import Loader from "react-js-loader";
import ViewPayments from "./view-payments";
const UserDashboard: React.FC = () => {
  const { userId, status } = useUserStore();
  return (
    <>
      {userId ? (
        <div className="flex flex-col md:flex-row h-auto gap-4 md:gap-0 mt-2">
          {/* Left Section */}
          <div className="w-full md:w-4/7 flex justify-center">
            <div className="bg-white shadow-2xl rounded-lg p-6 w-[98%] md:w-[98%]">
              <Profile />
              <IdUpload />
            </div>
          </div>

          {/* Right Section */}
          {status === "Active" && (
            <div className="w-full md:w-3/7 flex justify-center">
              <ViewPayments uid={userId} />
            </div>
          )}
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
