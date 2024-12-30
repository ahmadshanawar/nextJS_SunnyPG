"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import User from "../../../../public/images/user.png";
import { supabase } from "../../../lib/supabase"; // Assuming you've already set up Supabase client
import { LuBadgeAlert, LuBadgeCheck } from "react-icons/lu";
import { FaXmark } from "react-icons/fa6";
import { isValid } from "@make-sense/adhaar-validator";
import RoomDropdown from "./rooms_dropdown";
import ConfirmationDialog from "@/app/components/confirmation-dialog";
import { parseISO } from "date-fns";
import Loader from "react-js-loader";
import useUserStore from "@/lib/store/userStore";
import DateSelector from "@/app/components/DateSelector";

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
  room_number: number | null;
  start_date: string;
  end_date: string;
  rent_amount: number;
  PhotoIds: {
    profileUrl: string;
    adhaarFrontUrl: string;
    adhaarBackUrl: string;
    otherIdUrl: string;
  };
};

type TenantEditDialogProps = {
  uid: string;
  isOpen: boolean;
  onClose: () => void;
};

const TenantEditDialog: React.FC<TenantEditDialogProps> = ({
  uid,
  isOpen,
  onClose,
}) => {
  const [tenantData, setTenantData] = useState<UserDetails | null>(null);
  const [editedData, setEditedData] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<Boolean>(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const { userId } = useUserStore();

  useEffect(() => {
    if (uid && isOpen) {
      const fetchData = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from("Tennants")
          .select(`*,PhotoIds(*)`)
          .eq("uid", uid)
          .single();

        if (error) {
          console.error(error);
          setLoading(false);
        } else {
          setTenantData(data);
          setEditedData(data);
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [uid, isOpen]);

  useEffect(() => {
    if (tenantData && editedData) {
      const isDataModified =
        JSON.stringify(tenantData) !== JSON.stringify(editedData);
      setIsModified(isDataModified);
    }
  }, [editedData, tenantData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (editedData) {
      setEditedData({
        ...editedData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const updateTennantsTable = async () => {
    if (editedData) {
      const updateData = {
        name: editedData.name,
        mobile: editedData.mobile,
        email: editedData.email,
        room_number: editedData.status === "Active" ? editedData.room_number : null,
        status: editedData.status,
        adhaar: editedData.adhaar,
        start_date: editedData.start_date,
        end_date: editedData.end_date,
        rent_amount: editedData.rent_amount,
        mobile_verified: editedData.mobile_verified,
      };

      const { data, error } = await supabase
        .from("Tennants")
        .update(updateData)
        .eq("uid", editedData.uid);
      return { data, error };
    }
    return { data: null, error: null };
  };

  const incrementOccupancy = async (roomId: number) => {
    const { error } = await supabase.rpc("incrementoccupancy", {
      x: 1,
      row_id: roomId,
    });
    return { data: null, error };
  };

  const decrementOccupancy = async (roomId: number) => {
    const { error } = await supabase.rpc("incrementoccupancy", {
      x: -1,
      row_id: roomId,
    });
    return { data: null, error };
  };

  const handleSubmit = async () => {
    if (editedData) {
      if (!isValid(editedData.adhaar)) {
        alert("Aadhaar Number is invalid!");
        return;
      }

      const updateResult = await updateTennantsTable();
      if (updateResult.error) {
        console.error("Error updating Tennants table:", updateResult.error);
      }

      if (editedData.status === "Active") {
        if (editedData.room_number !== tenantData?.room_number) {
          if (editedData.room_number) {
            const incrementResult = await incrementOccupancy(editedData.room_number);
            if (incrementResult.error) {
              console.error("Error incrementing occupancy:", incrementResult.error);
            }
          }

          if (tenantData?.room_number) {
            const decrementResult = await decrementOccupancy(tenantData.room_number);
            if (decrementResult.error) {
              console.error("Error decrementing occupancy:", decrementResult.error);
            }
          }
        } else {
          if (editedData.room_number) {
            const incrementResult = await incrementOccupancy(editedData.room_number);
            if (incrementResult.error) {
              console.error("Error incrementing occupancy:", incrementResult.error);
            }
          }
        }
      } else {
        if (tenantData?.room_number) {
          const decrementResult = await decrementOccupancy(tenantData.room_number);
          if (decrementResult.error) {
            console.error("Error decrementing occupancy:", decrementResult.error);
          }
        }
      }

      if (updateResult.error) {
        console.error("One or more errors occurred during the operation.");
      } else {
        console.log("All operations completed successfully.");
        onClose();
      }
    }
  };

  const handleRoomSelect = (roomId: number | null) => {
    if (editedData) {
      setEditedData({
        ...editedData,
        room_number: roomId || 0, // Update room_number in editedData
      });
    }
  };

  const handleConfirm = () => {
    if (editedData && editedData.uid) {
      setEditedData({
        ...editedData,
        mobile_verified: !editedData.mobile_verified,
      });
    }
    setDialogOpen(false);
  };

  const handleCancel = () => setDialogOpen(false);

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-xl w-full overflow-auto max-h-[75vh]">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Edit Tenant Details</h3>
            <FaXmark
              onClick={onClose}
              className="text-gray-600 text-lg hover:text-gray-800 cursor-pointer"
            />
          </div>
          <hr />

          {tenantData && editedData && !loading ? (
            <>
              <div className="flex justify-center">
                <div className="w-[80%]">
                  <div className="mb-3 mt-3">
                    <label className="block mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      maxLength={60}
                      value={editedData?.name || ""}
                      onChange={handleInputChange}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block mb-1 flex flex-row items-center">
                      Mobile
                      {editedData.mobile_verified ? (
                        <LuBadgeCheck className="text-2xl text-green-500 ml-2" />
                      ) : (
                        <LuBadgeAlert className="text-2xl text-red-500 ml-2" />
                      )}
                      <button
                        onClick={() => setDialogOpen(true)}
                        className="ml-2 text-blue-500 hover:text-blue-700 underline focus:outline-none"
                        disabled={tenantData?.status === "Departed"}
                      >
                        {editedData.mobile_verified ? "Unverify" : "Verify"}
                      </button>
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      value={editedData?.mobile || ""}
                      maxLength={10}
                      onChange={handleInputChange}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      disabled
                      value={editedData?.email || ""}
                      onChange={handleInputChange}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block mb-1">Adhaar Number</label>
                    <input
                      type="text"
                      name="adhaar"
                      maxLength={12}
                      value={editedData?.adhaar || ""}
                      onChange={handleInputChange}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <hr className="mb-3 mt-6" />
                  <div className="mb-3">
                    <RoomDropdown
                      onRoomSelect={handleRoomSelect}
                      roomNumber={editedData.room_number || null}
                    />
                  </div>
                  <div className="mb-3">
                    <DateSelector
                      value={
                        editedData.start_date
                          ? parseISO(editedData.start_date)
                          : null
                      }
                      onChange={(date) =>
                        setEditedData((prev) => ({
                          ...prev!,
                          start_date: date,
                        }))
                      }
                      label="Start Date"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block mb-1">Rent Amount ₹</label>
                    <input
                      type="text"
                      name="rent_amount"
                      maxLength={12}
                      value={editedData?.rent_amount || ""}
                      onChange={handleInputChange}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block mb-1">Status</label>
                    <select
                      name="status"
                      id="statusDropdown"
                      value={editedData?.status}
                      onChange={handleInputChange}
                      className="text-sm block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-700 focus:outline-none hover:ring-1 focus:ring-purple-500 hover:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                  {editedData.status == "Departed" && (
                    <div className="mb-3">
                      <DateSelector
                        value={
                          editedData.end_date ? parseISO(editedData.end_date) : null
                        }
                        onChange={(date) =>
                          setEditedData((prev) => ({
                            ...prev!,
                            end_date: date,
                          }))
                        }
                        label="End Date"
                      />
                    </div>
                  )}
                  <hr className="my-6" />
                  <div className="space-y-4 mt-4">
                    <div>
                      <label>Profile Picture</label>
                      <Image
                        src={tenantData?.PhotoIds?.profileUrl || User}
                        alt="Profile"
                        width={256}
                        height={256}
                        className="rounded-lg shadow-lg"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                    <div>
                      <label>Aadhaar Front</label>
                      <Image
                        src={tenantData?.PhotoIds?.adhaarFrontUrl || User}
                        alt="Aadhaar Front"
                        width={256}
                        height={256}
                        className="rounded-lg shadow-lg"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                    <div>
                      <label>Aadhaar Back</label>
                      <Image
                        src={tenantData?.PhotoIds?.adhaarBackUrl || User}
                        alt="Aadhaar Back"
                        width={256}
                        height={256}
                        className="rounded-lg shadow-lg"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                    <div>
                      <label>Other ID</label>
                      <Image
                        src={tenantData?.PhotoIds?.otherIdUrl || User}
                        alt="Other ID"
                        width={256}
                        height={256}
                        className="rounded-lg shadow-lg"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr className="my-3" />
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={onClose}
                  className="bg-gray-500 hover:bg-gray-600  text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    !isModified ||
                    (editedData.status === "Active" && !editedData.start_date)
                  } // Disable if not modified or if status is Active and start date is not set
                  className={`${
                    isModified &&
                    (editedData.status !== "Active" || editedData.start_date)
                      ? "bg-purple-500"
                      : "bg-gray-400"
                  } text-white rounded py-2 px-4 focus:outline-none`}
                >
                  Save
                </button>
              </div>
            </>
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
        </div>

        <ConfirmationDialog
          isOpen={isDialogOpen}
          message={`Do you want to change this mobile number status?`}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </div>
    )
  );
};

export default TenantEditDialog;
