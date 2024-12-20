"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import User from "../../../../public/images/user.png";
import { supabase } from "../../../lib/supabase"; // Assuming you've already set up Supabase client
import { FaXmark } from "react-icons/fa6";

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

type ViewUserDialogProps = {
  uid: string;
  isOpen: boolean;
  onClose: () => void;
};

const TennatViewDialog: React.FC<ViewUserDialogProps> = ({
  uid,
  isOpen,
  onClose,
}) => {
  const [tenantData, setTenantData] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(false);

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
        } else {
          setTenantData(data);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [uid, isOpen]);

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden h-auto max-h-[90vh] p-8">
          {/* Dialog Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">Tenant Details</h3>
            <FaXmark
              className="cursor-pointer text-gray-500 hover:text-gray-700 transition"
              onClick={onClose}
            />
          </div>
          <hr className="mb-6 border-gray-300" />

          {tenantData && !loading ? (
            <div className="space-y-6 overflow-y-auto max-h-[70vh]">
              {/* Tenant Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="font-medium text-gray-600">Name:</span>
                  <p className="text-gray-700">{tenantData.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Mobile:</span>
                  <p className="text-gray-700">{tenantData.mobile}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Email:</span>
                  <p className="text-gray-700">{tenantData.email}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Adhaar:</span>
                  <p className="text-gray-700">{tenantData.adhaar}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Room Number:</span>
                  <p className="text-gray-700">{tenantData.room_number}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Start Date:</span>
                  <p className="text-gray-700">{tenantData.start_date}</p>
                </div>
                {tenantData.status === "Departed" && (
                  <div>
                    <span className="font-medium text-gray-600">End Date:</span>
                    <p className="text-gray-700">{tenantData.end_date}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-600">Rent Amount:</span>
                  <p className="text-gray-700">₹{tenantData.rent_amount}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <p className="text-gray-700">{tenantData.status}</p>
                </div>
              </div>

              {/* Images Section */}
              <div className="mt-6">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Images</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="block font-medium text-gray-600 mb-2">
                      Profile Picture
                    </span>
                    <Image
                      src={tenantData?.PhotoIds?.profileUrl || User}
                      alt="Profile"
                      width={256}
                      height={256}
                      className="rounded-lg shadow-lg"
                      style={{ width: "80%", height: "auto" }}
                    />
                  </div>
                  <div>
                    <span className="block font-medium text-gray-600 mb-2">
                      Aadhaar Front
                    </span>
                    <Image
                      src={tenantData?.PhotoIds?.adhaarFrontUrl || User}
                      alt="Aadhaar Front"
                      width={256}
                      height={256}
                      className="rounded-lg shadow-lg"
                      style={{ width: "80%", height: "auto" }}
                    />
                  </div>
                  <div>
                    <span className="block font-medium text-gray-600 mb-2">
                      Aadhaar Back
                    </span>
                    <Image
                      src={tenantData?.PhotoIds?.adhaarBackUrl || User}
                      alt="Aadhaar Back"
                      width={256}
                      height={256}
                      className="rounded-lg shadow-lg"
                      style={{ width: "80%", height: "auto" }}
                    />
                  </div>
                  <div>
                    <span className="block font-medium text-gray-600 mb-2">
                      Other ID
                    </span>
                    <Image
                      src={tenantData?.PhotoIds?.otherIdUrl || User}
                      alt="Other ID"
                      width={256}
                      height={256}
                      className="rounded-lg shadow-lg"
                      style={{ width: "80%", height: "auto" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">Loading...</p>
          )}
        </div>
      </div>
    )
  );
};

export default TennatViewDialog;