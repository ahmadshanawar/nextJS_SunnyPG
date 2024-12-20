"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import User from "../../../../public/images/user.png";
import { supabase } from "../../../lib/supabase"; // Assuming you've already set up Supabase client
import { FaCertificate, FaCheck, FaCross } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { isValid } from "@make-sense/adhaar-validator";
import RoomDropdown from "./rooms_dropdown";

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

  const handleSubmit = async () => {
    if (editedData) {
      if (!isValid(editedData.adhaar)) {
        alert("Aadhaar Number is invalid!");
        return;
      }
      const { error } = await supabase
        .from("Tennants")
        .update({
          name: editedData.name,
          mobile: editedData.mobile,
          email: editedData.email,
          room_number: editedData.room_number,
          status: editedData.status,
          adhaar: editedData.adhaar,
          start_date: editedData.start_date,
          end_date: editedData.end_date,
          rent_amount: editedData.rent_amount,
          mobile_verified: editedData.mobile_verified,
        })
        .eq("uid", editedData.uid);

      if (error) {
        console.error(error);
      } else {
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

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-xl w-full overflow-auto h-auto max-h-[90vh]">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Edit Tenant Details</h3>
            <FaXmark onClick={onClose} />
          </div>
          <hr />
          {tenantData && editedData && !loading ? (
            <>
              <div className="max-w-md">
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
                      <FaCertificate className="text-green-500 ml-2" />
                    ) : (
                      <FaCertificate className="text-red-500 ml-2" />
                    )}
                    <button
                      onClick={() => {
                        setEditedData({
                          ...editedData,
                          mobile_verified: !editedData.mobile_verified, // Update room_number in editedData
                        });
                      }}
                      className="bg-purple-800 hover:bg-purple-700 text-white px-1 py-0 rounded ml-2"
                    >
                      Verify
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
                    roomNumber={editedData.room_number}
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={editedData?.start_date || ""}
                    onChange={handleInputChange}
                    className="border rounded p-2 w-full"
                  />
                </div>
                {editedData.status == "Departed" && (
                  <div className="mb-3">
                    <label className="block mb-1">End Date</label>
                    <input
                      type="date"
                      name="end_date"
                      value={editedData?.end_date}
                      onChange={handleInputChange}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                )}
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

                <div className="space-y-4 mt-4">
                  <div>
                    <label>Profile Picture</label>
                    <Image
                      src={tenantData?.PhotoIds?.profileUrl || User}
                      alt="Profile"
                      width={256}
                      height={256}
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
                      style={{ width: "100%", height: "auto" }}
                    />
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
                  className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    )
  );
};

export default TenantEditDialog;
