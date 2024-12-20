"use client";

import Image from "next/image";
import User from "../../../../public/images/user.png";
import clsx from "clsx";
import { FaPen } from "react-icons/fa";
import TenantEditDialog from "./tennant-edit-dialog";
import { useState } from "react";
import { addMonths, format } from "date-fns";

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
  start_date: string;
  PhotoIds: {
    profileUrl: string;
    adhaarFrontUrl: string;
    adhaarBackUrl: string;
    otherIdUrl: string;
  };
};

type TennantCardProps = {
  user: UserDetails;
};

const StatusIndicator: React.FC<{ status: string }> = ({ status }) => {
  const statusClasses: Record<string, string> = {
    Pending: "bg-orange-500",
    "Awaiting Approval": "bg-yellow-400",
    Active: "bg-green-500",
  };

  return (
    <div
      className={clsx(
        "absolute bottom-1 right-1 w-4 h-4 border-2 border-white rounded-full",
        statusClasses[status] || "bg-gray-400"
      )}
    />
  );
};

const TennantCard: React.FC<TennantCardProps> = ({ user }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleEditClick = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };
  return (
    <div className="my-2 mx-2">
      <div className="p-4 bg-white rounded-lg shadow-xl overflow-hidden flex flex-column">
        {/* Image Section */}
        <div className="relative w-16 h-16 m-2 ml-4">
          <div className="w-full h-full rounded-full overflow-hidden">
            <Image
              src={user?.PhotoIds?.profileUrl || User}
              alt={`Profile of ${user?.name}`}
              width={128}
              height={128}
              className="object-cover aspect-square"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <StatusIndicator status={user?.status} />
          <div className="flex justify-center items-center mt-2">
            <button
              onClick={handleEditClick}
              className="bg-purple-500 text-xs text-white px-2 py-1 rounded hover:bg-purple-800 transition flex items-center"
            >
              Edit
              <FaPen className="ml-2" /> {/* Pencil icon with margin to the left */}
            </button>
          </div>
        </div>
        {/* Content Section */}
        <div className="ml-4">
          <h2 className="text-lg font-semibold text-gray-800">{user?.name}</h2>
          <p className="text-sm text-gray-600">
            <strong>Mobile:</strong> {user?.mobile}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Email:</strong> {user?.email}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Room: </strong>
            {user?.room_number}
          </p>
          {user.status === "Active" ? (
            <p className="text-sm text-gray-600">
              <strong>Billing Period: </strong>
              {format(new Date(user?.start_date), "dd/MM/yyyy")}-
              {format(addMonths(new Date(user?.start_date), 1), "dd/MM/yyyy")}
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              <strong>Status: </strong>
              {user?.status}
            </p>
          )}
        </div>
      </div>
      <TenantEditDialog uid={user.uid} isOpen={open} onClose={handleCloseDialog} />
    </div>
  );
};

export default TennantCard;
