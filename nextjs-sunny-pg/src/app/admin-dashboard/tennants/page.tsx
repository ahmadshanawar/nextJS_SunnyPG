"use client";
import TennantCard from "./tennant-card";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import Loader from "react-js-loader";

type PaymentDetails = {
  billing_start_date: string;
  billing_end_date: string;
  paid: boolean;
};

type UserDetails = {
  uid: string;
  name: string;
  mobile: string;
  adhaar: string;
  email: string;
  status: string;
  mobile_verified: boolean;
  role: string;
  occupation: string;
  institution: string;
  room_number: number;
  room_type: string;
  start_date: string;
  PhotoIds: {
    profileUrl: string;
    adhaarFrontUrl: string;
    adhaarBackUrl: string;
    otherIdUrl: string;
  };
  Payments: PaymentDetails[];
};

export default function Tennants() {
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUserType, setSelectedUserType] = useState("Active");
  async function getUsers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Tennants")
        .select(`*,PhotoIds(*),Payments(*)`)
        .eq("role", "user")
        .eq("status", selectedUserType)
        .order("room_number", { ascending: true });

      if (error) {
        console.log(error);
        setLoading(false);
      }
      if (data) {
        setUsers(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserType(event.target.value);
  };

  useEffect(() => {
    getUsers();
  }, [selectedUserType]);

  return (
    <>
      <div className="mt-4 mx-2 w-[95vw]">
        <div className="flex justify-between">
          <div className="my-2 ml-5 text-bold text-xl text-gray-800"></div>
          <div className="flex justify-end items-center">
            <div className="w-full max-w-xs mx-auto mr-2 flex flex-row items-center">
              <FaUsers className="text-3xl text-gray-600 text-bold mr-1" />
              <select
                id="statusDropdown"
                value={selectedUserType || ""}
                onChange={handleChange}
                className="text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 bg-white text-gray-700 focus:outline-none hover:ring-1 focus:ring-purple-500 hover:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="Active" className="text-sm">
                  Active
                </option>
                <option value="Awaiting Approval" className="text-sm">
                  Awaiting Approval
                </option>
                <option value="Pending" className="text-sm">
                  Pending
                </option>
                <option value="Departed" className="text-sm">
                  Departed
                </option>
              </select>
            </div>
            <h3 className="text-lg font-semibold">Tennants</h3>
          </div>
        </div>
        <hr className="h-px my-2 bg-gray-200 border-0" />
      </div>
      {users?.length === 0 && !loading && (
        <div className="text-center my-5">No Users Found</div>
      )}
      {!loading ? (
        <div className="h-[calc(100vh-150px)] overflow-y-auto mx-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {users?.map((user: UserDetails) => {
              return (
                <div key={user.uid}>
                  <TennantCard user={user} refreshUsers={getUsers} />
                </div>
              );
            })}
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
}
