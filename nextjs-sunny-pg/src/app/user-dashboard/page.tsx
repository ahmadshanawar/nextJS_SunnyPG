"use client";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useEffect, useState } from "react";
import Hostel from "../../../public/images/hostel.png";
import Profile from "./profile";
import { useRouter } from "next/navigation";
import { checkForSession } from "@/lib/sessions";

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

const UserDashboard: React.FC = () => {
  const router = useRouter();
  const checkSession = async () => {
    let res = await checkForSession();
    if (!res) {
      router.push("/");
    }
  };
  checkSession();
  
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

  async function handleLogout() {
    await supabase.auth.signOut();
    localStorage.removeItem("supabaseSession");
    router.push("/");
  }

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="mt-4 bg-purple-800 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      <div className="flex flex-col md:flex-row h-auto mt-5 gap-4 md:gap-0">
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="bg-white shadow-2xl rounded-lg p-8 w-[90%] md:w-[95%]">
            <h4 className="text-gray-600 text-xl md:text-xl font-bold mb-4">
              Profile
            </h4>
            <Profile />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="bg-white shadow-2xl rounded-lg p-8 w-[90%] md:w-[95%]">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              Right Section Card
            </h2>
            <p className="text-gray-600">
              This is the content of the right section. Add more components or
              text here as needed.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
