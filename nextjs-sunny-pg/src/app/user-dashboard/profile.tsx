"use client";
import useUserStore from "@/lib/store/userStore";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import User from "../../../public/images/user.png";
import { uploadPhoto } from "./helpers/helper";
import { compressImage } from "./helpers/compressImage";
import clsx from "clsx";
import { isValid } from "@make-sense/adhaar-validator";
import Loader from "react-js-loader";

type UserData = {
  name: string;
  mobile: string;
  adhaar: string;
  email: string;
  occupation: string;
  institution: string;
  profile_photo: string;
  status: string;
};

const Profile = () => {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    mobile: "",
    adhaar: "",
    email: "",
    occupation: "",
    institution: "",
    profile_photo: "",
    status: "",
  });
  const { userId, status, setStatus } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const fetchUserData = async () => {
    if (!userId) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("Tennants")
      .select("*")
      .eq("uid", userId)
      .single();

    const { data: photoData, error: photoError }: { data: any; error: any } =
      await supabase.from("PhotoIds").select("profileUrl").eq("uid", userId);
    let allUserData = { ...data, profile_photo: photoData[0]?.profileUrl };

    if (data) {
      setUserData(allUserData);
      setStatus(allUserData.status);
      setLoading(false);
    }
    if (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
    if (photoError) {
      console.error("Error fetching photo:", photoError);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null); // Clear the message after 3 seconds
      }, 3000);
      // Cleanup timer if component unmounts or message changes
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (photoError) {
      const timer = setTimeout(() => {
        setPhotoError(null); // Clear the error message after 5 seconds
      }, 5000);
      // Cleanup timer if component unmounts or error message changes
      return () => clearTimeout(timer);
    }
  }, [photoError]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (userId) {
      setIsLoadingPhoto(true);
      const pathName = `photo-ids/${userId}/profilePhoto/`;
      const file: any = event.target.files?.[0];
      const compressedFile: any = await compressImage(file);
      if (!compressedFile) {
        setPhotoError("Failed to upload photo. Please check you image file.");
      }
      if (!file) return;
      try {
        const updatedPhotoUrl = await uploadPhoto(
          userId,
          pathName,
          "profile",
          compressedFile
        );
        if (updatedPhotoUrl) {
          setUserData((prev) => ({ ...prev, profile_photo: updatedPhotoUrl }));
        }
      } catch (error) {
        console.error("Error uploading photo:", error);
        setPhotoError(
          "Failed to upload photo. Please try again with a different image file."
        );
      } finally {
        setIsLoadingPhoto(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (userData.name.length > 80 || /\d/.test(userData.name)) {
      newErrors.name =
        "Name must be less than 80 characters and cannot contain numbers.";
    }

    if (!/^\d{10}$/.test(userData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits.";
    }

    if (!/^\d{12}$/.test(userData.adhaar) || !isValid(userData.adhaar)) {
      newErrors.adhaar = "Aadhaar number must be Valid 12 digits number.";
    }

    if (userData.institution.length > 100) {
      newErrors.institution = "Institution name must be less than 100 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;

    setIsLoadingSave(true);
    setMessage(null);
    setIsSuccess(null);

    const { name, mobile, occupation, institution } = userData;

    const { data, error } = await supabase
      .from("Tennants")
      .update({
        name: name,
        mobile: mobile,
        occupation: occupation,
        institution: institution,
      })
      .eq("uid", userId);

    setIsLoadingSave(false);

    if (!error) {
      setIsEditing(false);
      setIsSuccess(true);
      setMessage("Profile updated successfully!");
    } else {
      console.error("Error saving user data:", error);
      setIsSuccess(false);
      setMessage("Failed to save data. Please try again.");
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const StatusIndicator = ({ status }: { status: string | null }) => {
    const statusClasses: any = {
      Pending: "bg-orange-600",
      "Awaiting Approval": "bg-yellow-300",
      Active: "bg-green-600",
    };

    return (
      <div
        className={clsx(
          "bottom-0 right-0 absolute w-10 h-10 border-2 border-white rounded-full",
          statusClasses[status || ""] || "bg-gray-400" // Default color if status is unknown
        )}
      />
    );
  };

  return (
    <>
      {loading ? (
        <div role="status" className="flex items-center justify-center h-[70vh]">
          <Loader
            type="hourglass"
            bgColor={"#7c3ab3"}
            color={"#828282"}
            title={"Loading..."}
            size={60}
          />
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">User Profile</h2>
          <hr className="my-3" />
          <div className="bg-white flex flex-col items-center justify-center p-4">
            {/* Avatar */}
            <div className="text-center border-2 rounded-lg px-3 py-1 mb-4">
              <span className="text-md ">
                Status: <strong className="text-md">{status}</strong>
              </span>
            </div>
            <div className="items-center justify-center">
              {isLoadingPhoto ? (
                <div
                  role="status"
                  className="flex items-center justify-center h-[70vh]"
                >
                  <Loader
                    type="hourglass"
                    bgColor={"#7c3ab3"}
                    color={"#828282"}
                    title={"Loading..."}
                    size={60}
                  />
                </div>
              ) : (
                <div className="relative">
                  <Image
                    key={userData.email}
                    height="64"
                    width="64"
                    src={userData?.profile_photo || User}
                    alt={`Profile-${userData?.profile_photo}`}
                    unoptimized
                    priority
                    className="w-32 h-32 shadow-lg rounded-full object-cover ml-1 my-2"
                  />
                  <StatusIndicator status={status} />
                </div>
              )}
            </div>
            <div className="mt-3 text-center">
              <p className="text-gray-700 font-semibold">{userData.occupation}</p>
              <p className="text-lg font-bold text-gray-600">
                {userData.institution}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <button
                onClick={handleClick}
                className="my-4 bg-purple-800 hover:bg-purple-700 text-white px-3 py-1 rounded disabled:opacity-50"
                disabled={isLoadingPhoto}
              >
                Edit Profile Picture
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                ref={fileInputRef}
                className="hidden"
              />
            </div>

            {/* Error / Success Message */}
            {message && (
              <div
                className={`mt-4 px-5 rounded text-white ${
                  isSuccess ? "bg-green-400" : "bg-red-600"
                }`}
              >
                {message}
              </div>
            )}

            {/* Photo Error Message */}
            {photoError && (
              <div className="mt-4 px-5 py-3 rounded text-white bg-red-400">
                {photoError}
              </div>
            )}

            {/* Editable Form */}
            <div className="mt-2 w-full">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        maxLength={80}
                        placeholder="Name"
                        className="p-3 border rounded w-full"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="mobile"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mobile
                      </label>
                      <input
                        type="text"
                        id="mobile"
                        name="mobile"
                        maxLength={10}
                        value={userData.mobile}
                        onChange={handleInputChange}
                        placeholder="Mobile"
                        className="p-3 border rounded w-full"
                      />
                      {errors.mobile && (
                        <p className="text-red-500 text-sm">{errors.mobile}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="occupation"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Occupation
                      </label>
                      <input
                        type="text"
                        id="occupation"
                        name="occupation"
                        value={userData.occupation}
                        onChange={handleInputChange}
                        maxLength={80}
                        placeholder="Occupation"
                        className="p-3 border rounded w-full"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="institution"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Institution
                      </label>
                      <input
                        type="text"
                        id="institution"
                        name="institution"
                        value={userData.institution}
                        onChange={handleInputChange}
                        placeholder="Institution"
                        maxLength={100}
                        className="p-3 border rounded w-full"
                      />
                      {errors.institution && (
                        <p className="text-red-500 text-sm">{errors.institution}</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <ul className="space-y-2 text-gray-800">
                  <hr />
                  <li className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Name:</span>
                    <span className="text-gray-600">{userData.name}</span>
                  </li>
                  <hr />
                  <li className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Mobile:</span>
                    <span className="text-gray-600">{userData.mobile}</span>
                  </li>
                  <hr />
                  <li className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Aadhaar:</span>
                    <span className="text-gray-600">{userData.adhaar}</span>
                  </li>
                  <hr />
                  <li className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Email:</span>
                    <span className="text-gray-600">{userData.email}</span>
                  </li>
                  <hr />
                </ul>
              )}

              <div className="flex justify-end">
                {isEditing && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="mt-8 mx-2 bg-purple-800 hover:bg-purple-700 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                )}
                {!isEditing && status === "Pending" && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="mt-8 bg-purple-800 hover:bg-purple-700 text-white px-4 py-2 rounded"
                  >
                    Edit Profile
                  </button>
                )}
                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="mt-8 bg-purple-800 hover:bg-purple-700 text-white px-4 py-2 rounded"
                    disabled={isLoadingSave}
                  >
                    {isLoadingSave ? (
                      <div className="animate-spin w-6 h-6 border-4 border-t-4 border-white rounded-full"></div>
                    ) : (
                      "Save"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
