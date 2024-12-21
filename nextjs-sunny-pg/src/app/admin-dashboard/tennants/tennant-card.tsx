"use client";

import Image from "next/image";
import User from "../../../../public/images/user.png";
import clsx from "clsx";
import { FaPen } from "react-icons/fa";
import TenantEditDialog from "./tennant-edit-dialog";
import { useState } from "react";
import { format } from "date-fns";
import TennatViewDialog from "./tennant-view-dialog";

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
  refreshUsers: () => void;
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

const TennantCard: React.FC<TennantCardProps> = ({ user, refreshUsers }) => {
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openViewDialog, setOpenViewDialog] = useState<boolean>(false);

  const handleEditDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    refreshUsers();
  };

  const handleViewDialogClick = () => {
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
  };
  return (
    <div className="my-2 mx-2">
      <div
        className="p-4 bg-white rounded-lg shadow-xl hover:shadow-2xl cursor-pointer transform transition-transform duration-300 hover:scale-105 overflow-hidden flex flex-column"
        onClick={handleViewDialogClick}
      >
        {/* Image Section */}
        <div className="flex items-center">
          <div className="relative w-16 h-16">
            <div className="w-full h-full rounded-full overflow-hidden">
              <Image
                src={user?.PhotoIds?.profileUrl || User}
                alt={`Profile of ${user?.name}`}
                width={256}
                height={256}
                className="object-cover aspect-square"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <StatusIndicator status={user?.status} />
          </div>
        </div>
        {/* Content Section */}
        <div className="ml-4">
          <div className="flex flex-row items-center">
            <h2 className="text-lg font-semibold text-gray-800">{user?.name}</h2>
            {user.status !== "Departed" && (
              <button onClick={handleEditDialogClick}>
                <FaPen className="ml-3 text-gray-600 hover:text-gray-900" />
              </button>
            )}
          </div>

          <p className="text-sm text-gray-600 whitespace-nowrap">
            <strong>Mobile:</strong> {user?.mobile}
          </p>
          <p className="text-sm text-gray-600 whitespace-nowrap">
            <strong>Room: </strong>
            {user?.room_number}
          </p>
          {user.status === "Active" ? (
            <p className="text-sm text-gray-600 whitespace-nowrap">
              <strong>Check In Date: </strong>
              {format(new Date(user?.start_date), "dd/MM/yyyy")}
            </p>
          ) : (
            <p className="text-sm text-gray-600 whitespace-nowrap">
              <strong>Status: </strong>
              {user?.status}
            </p>
          )}
        </div>
      </div>
      <TenantEditDialog
        uid={user.uid}
        isOpen={openEditDialog}
        onClose={handleCloseEditDialog}
      />
      <TennatViewDialog
        uid={user.uid}
        isOpen={openViewDialog}
        onClose={handleCloseViewDialog}
      />
    </div>
  );
};

export default TennantCard;
