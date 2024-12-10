"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

type UserData = {
  name: string;
  mobile: string;
  aadhaar: string;
  email: string;
  occupation: string;
  institution: string;
  profile_photo: string;
};

type Payment = {
  amount: number;
  payment_date: string;
};

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    mobile: "",
    aadhaar: "",
    email: "",
    occupation: "",
    institution: "",
    profile_photo: "",
  });

  const [payments, setPayments] = useState<Payment[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    fetchUserData();
    fetchPayments();
  }, []);

  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", "USER_ID")
      .single();

    if (data) setUserData(data);
    if (error) console.error("Error fetching user data:", error);
  };

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", "USER_ID");

    if (data) setPayments(data);
    if (error) console.error("Error fetching payments:", error);
  };

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = `${file.name}`;
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (data) {
      const publicUrl = supabase.storage
        .from("avatars")
        .getPublicUrl(data.path);
      setUserData((prev) => ({
        ...prev,
        profile_photo: publicUrl.data.publicUrl,
      }));

      await supabase
        .from("users")
        .update({ profile_photo: publicUrl.data.publicUrl })
        .eq("id", "USER_ID");
    }

    if (error) console.error("Error uploading photo:", error);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const { name, mobile, aadhaar, occupation, institution } = userData;

    const { error } = await supabase
      .from("users")
      .update({ name, mobile, aadhaar, occupation, institution })
      .eq("id", "USER_ID");

    if (!error) setIsEditing(false);
    if (error) console.error("Error saving user data:", error);
  };

  return (
    <div className="bg-white flex flex-col items-center justify-center">
      {/* Avatar */}
      <div className="relative">
        <img
          src={userData.profile_photo || "/default-avatar.png"}
          alt="Profile"
          className="w-32 h-32 shadow-lg rounded-full object-cover ml-1 my-2"
        />
        {/* Occupation and Institution */}
        <div className="mt-1 text-center">
          <p className="text-gray-800">{userData.occupation}Student</p>
          <p className="text-lg font-semibold">
            {userData.institution}BBD University
          </p>
        </div>
      </div>
      {/* Editable Form */}
      <div className="mt-6 w-full">
        {isEditing ? (
          <>
            <div className="flex items-center justify-center ml-12">
              <strong className="text-gray-800 mr-5">Profile Picture:</strong>{" "}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="my-6  cursor-pointer"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="mobile"
                value={userData.mobile}
                onChange={handleInputChange}
                placeholder="Mobile"
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="occupation"
                value={userData.occupation}
                onChange={handleInputChange}
                placeholder="Occupation"
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="institution"
                value={userData.institution}
                onChange={handleInputChange}
                placeholder="Institution"
                className="p-2 border rounded"
              />
            </div>
          </>
        ) : (
          <ul className="text-gray-700 text-center">
            <li className="mb-2">
              <strong>Name:</strong> {userData.name}Ahmad Shanawar
            </li>
            <li className="mb-2">
              <strong>Mobile:</strong> {userData.mobile} 8147335246
            </li>
            <li className="mb-2">
              <strong>Aadhaar:</strong> {userData.aadhaar} 4567789798797
            </li>
            <li className="mb-2">
              <strong>Email:</strong> {userData.email} shanawer@gmail.com
            </li>
          </ul>
        )}
        <div className="flex justify-end">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="mt-4 bg-purple-800 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            {isEditing ? "Save" : "Edit Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
