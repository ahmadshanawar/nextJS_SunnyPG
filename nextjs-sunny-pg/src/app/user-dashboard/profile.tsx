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
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const fetchUserData = async () => {
    if (!userId) return;

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
    }
    if (error) console.error("Error fetching user data:", error);
    if (photoError) console.error("Error fetching photo:", photoError);
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

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (userId) {
      setIsLoadingPhoto(true);
      const pathName = `photo-ids/${userId}/profilePhoto/`;
      const file: any = event.target.files?.[0];
      const compressedFile: any = await compressImage(file);
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
    <div className="bg-white flex flex-col items-center justify-center p-4">
      {/* Avatar */}
      <div className="text-center bg-purple-900 shadow-sm rounded-lg px-3 py-1 mb-4">
        <span className="text-md text-[#fff]">
          Status: <strong className="text-md">{status}</strong>
        </span>
      </div>
      <div className="items-center justify-center">
        {isLoadingPhoto ? (
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
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
        <p className="text-lg font-bold text-gray-600">{userData.institution}</p>
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

      {/* Editable Form */}
      <div className="mt-2 w-full">
        {isEditing ? (
          <>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <button
                onClick={handleClick}
                className="my-4 bg-purple-800 hover:bg-purple-700 text-white px-3 py-1 rounded disabled:opacity-50"
                disabled={isLoadingPhoto}
              >
                Change Profile Picture
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                ref={fileInputRef}
                className="hidden"
              />
            </div>

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
  );
};

export default Profile;
