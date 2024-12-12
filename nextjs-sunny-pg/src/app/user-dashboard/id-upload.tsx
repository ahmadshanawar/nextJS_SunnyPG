"use client";
import React, { useEffect, useState } from "react";
import { uploadPhoto } from "./helpers/helper";
import Image from "next/image";
import useUserStore from "@/lib/store/userStore";
import { supabase } from "@/lib/supabase";
import User from "../../../public/images/user.png";
import { compressImage } from "./helpers/compressImage";

const IdUpload = () => {
  const { userId, status, setStatus } = useUserStore();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [registrationMessage, setRegistrationMessage] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<any>({
    profileUrl: null,
    adhaarFront: null,
    adhaarBack: null,
    alternateId: null,
  });

  // Loading states for each image
  const [loadingStates, setLoadingStates] = useState({
    adhaarFront: false,
    adhaarBack: false,
    alternateId: false,
  });

  useEffect(() => {
    // Fetch the image URLs when the component mounts
    const fetchImages = async () => {
      const urls = await fetchIdPhotosUrl(userId);
      setImageUrls(urls);
    };

    fetchImages();
  }, [userId]);

  const fetchIdPhotosUrl = async (userId: string | null) => {
    if (userId) {
      try {
        const { data, error }: { data: any; error: any } = await supabase
          .from("PhotoIds")
          .select("*")
          .eq("uid", userId);

        if (error) throw error;
        const urls = {
          profile: data[0]?.profileUrl,
          adhaarFront: data[0]?.adhaarFrontUrl,
          adhaarBack: data[0]?.adhaarBackUrl,
          alternateId: data[0]?.otherIdUrl,
        };
        return urls;
      } catch (error) {
        console.log("Error fetching image URLs:", error);
        return {
          profile: null,
          adhaarFront: null,
          adhaarBack: null,
          alternateId: null,
        };
      }
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    idType: "adhaarFront" | "adhaarBack" | "alternateId"
  ) => {
    const file = event.target.files ? event.target.files[0] : null;

    // Set loading state to true for the selected ID type
    setLoadingStates((prev) => ({ ...prev, [idType]: true }));

    let pathName = "";
    switch (idType) {
      case "adhaarFront":
        pathName = `photo-ids/${userId}/adhaarFront/`;
        break;
      case "adhaarBack":
        pathName = `photo-ids/${userId}/adhaarBack/`;
        break;
      default:
        pathName = `photo-ids/${userId}/alternateId/`;
        break;
    }

    if (file) {
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        alert("Only .jpg, .jpeg, or .png files are allowed.");
        setLoadingStates((prev) => ({ ...prev, [idType]: false }));
        return;
      }
      const compressedFile: any = await compressImage(file);
      await uploadPhoto(userId, pathName, idType, compressedFile);

      // After uploading, fetch the updated URLs
      const urls = await fetchIdPhotosUrl(userId);
      setImageUrls(urls);

      // Set loading state to false after fetching new URLs
      setLoadingStates((prev) => ({ ...prev, [idType]: false }));
    }
  };

  async function handleConfirmRegister() {
    try {
      const { data, error }: { data: any; error: any } = await supabase
        .from("Tennants")
        .update({ status: "Awaiting Approval" })
        .eq("uid", userId);
      if (error) {
        setRegistrationMessage("Something went wrong Please check with office!");
      }
      //setting Store variable
      setStatus("Awaiting Approval");
      setRegistrationMessage("Registration form was sent sucessfully");
      setIsDialogOpen(false);
    } catch (error) {
      setRegistrationMessage("Something went wrong Please check with office!");

      console.log(error);
    }
  }
  const handleRegisterUser = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  const renderFilePreview = (imageUrl: string | null, isLoading: boolean) => {
    return (
      <div className="mt-2 p-4 bg-white relative">
        {isLoading ? (
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
          <Image
            src={imageUrl || User}
            alt="uploaded preview"
            className="w-full h-20"
            height={150}
            width={150}
          />
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h4 className="text-md font-semibold mb-4 text-center">
        {status === "Pending" ? "Upload Your" : "Your Uploaded"} ID Documents
      </h4>
      {status === "Pending" && (
        <p className="text-center text-gray-500 text-sm">
          Upload files with size less than 5MB
        </p>
      )}
      <hr />
      <div className="flex flex-wrap gap-4 items-center justify-center mb-4">
        {/* Aadhaar Front */}
        <div className="flex flex-col items-center shadow-2xl">
          <div className="mt-2 text-center p-4">Adhaar Card Front</div>
          {status === "Pending" && (
            <button
              onClick={() => document.getElementById("adhaarFrontInput")?.click()}
              className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-1 rounded"
            >
              Choose File
            </button>
          )}
          <input
            id="adhaarFrontInput"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "adhaarFront")}
            className="hidden"
          />
          {renderFilePreview(imageUrls?.adhaarFront, loadingStates.adhaarFront)}
        </div>

        {/* Aadhaar Back */}
        <div className="flex flex-col items-center shadow-2xl">
          <div className="mt-2 text-center p-4">Adhaar Card Back</div>
          {status === "Pending" && (
            <button
              onClick={() => document.getElementById("adhaarBackInput")?.click()}
              className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-1 rounded"
            >
              Choose File
            </button>
          )}
          <input
            id="adhaarBackInput"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "adhaarBack")}
            className="hidden"
          />
          {renderFilePreview(imageUrls?.adhaarBack, loadingStates?.adhaarBack)}
        </div>

        {/* Alternate ID */}
        <div className="flex flex-col items-center shadow-2xl">
          <div className="mt-2 text-center p-4">College/Alternate Id</div>

          {status === "Pending" && (
            <button
              onClick={() => document.getElementById("alternateIdInput")?.click()}
              className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-1 rounded"
            >
              Choose File
            </button>
          )}
          <input
            id="alternateIdInput"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "alternateId")}
            className="hidden"
          />
          {renderFilePreview(imageUrls?.alternateId, loadingStates.alternateId)}
        </div>
      </div>
      {registrationMessage && (
        <div
          className="p-4 my-4 text-sm text-green-800 rounded-lg bg-green-100 bg-gray-100 dark:text-green-600"
          role="alert"
        >
          <span className="font-medium">{registrationMessage}</span>
        </div>
      )}
      <hr />
      <div className="mt-4 flex justify-end">
        {status === "Pending" && (
          <button
            onClick={handleRegisterUser}
            className="bg-purple-800 hover:bg-purple-700 text-white px-6 disabled:opacity-50 py-2 rounded"
            disabled={
              !imageUrls?.adhaarFront ||
              !imageUrls?.adhaarBack ||
              !imageUrls?.alternateId ||
              !imageUrls?.profile
            }
          >
            Register
          </button>
        )}
      </div>
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mx-5">
          <div className="bg-white p-6 rounded-md w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Confirm Registration</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to proceed with registration? Please ensure the
              uploaded ID proofs are correct for a successfull registration. All the
              information provided will be verified by us!
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-purple-800 hover:bg-purple-700 text-white px-3 py-1 rounded"
                onClick={handleDialogClose}
              >
                Cancel
              </button>
              <button
                className="bg-purple-800 hover:bg-purple-700 text-white px-3 py-1 rounded"
                onClick={handleConfirmRegister}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdUpload;