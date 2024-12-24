"use client";
import React, { useEffect, useState } from "react";
import { uploadPhoto } from "./helpers/helper";
import Image from "next/image";
import useUserStore from "@/lib/store/userStore";
import { supabase } from "@/lib/supabase";
import IdCard from "../../../public/images/id-card.png";
import { compressImage } from "./helpers/compressImage";
import Loader from "react-js-loader";

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
  const fetchImages = async () => {
    const urls = await fetchIdPhotosUrl(userId);
    setImageUrls(urls);
  };
  useEffect(() => {
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
          profileUrl: data[0]?.profileUrl,
          adhaarFront: data[0]?.adhaarFrontUrl,
          adhaarBack: data[0]?.adhaarBackUrl,
          alternateId: data[0]?.otherIdUrl,
        };
        return urls;
      } catch (error) {
        console.log("Error fetching image URLs:", error);
        return {
          profileUrl: null,
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
      const updatedUrl = await uploadPhoto(userId, pathName, idType, compressedFile);

      // Update the state with the new URL
      setImageUrls((prev: any) => ({ ...prev, [idType]: updatedUrl }));

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
      setRegistrationMessage("Registration form was submitted sucessfully");
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
      <div className="mt-2 rounded bg-white relative">
        {isLoading ? (
          <div role="status" className="flex items-center justify-center h-auto">
            <Loader
              type="hourglass"
              bgColor={"#7c3ab3"}
              color={"#828282"}
              title={"Loading..."}
              size={60}
            />
          </div>
        ) : (
          <Image
            src={imageUrl || IdCard}
            alt="uploaded preview"
            className="w-full max-h-48 object-cover"
            height={756}
            width={756}
          />
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-1">
      <h4 className="text-md font-semibold mb-4 text-center">
        {status === "Pending" ? "Upload Your" : "Your Uploaded"} ID Documents
      </h4>
      {status === "Pending" && (
        <p className="text-center text-gray-500 text-sm">
          Upload files with size less than 5MB
        </p>
      )}
      <hr />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Aadhaar Front */}
        <div className="flex flex-col items-center shadow-xl rounded">
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
              !imageUrls?.alternateId
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
              Are you sure you want to proceed with new registration? Please ensure
              uploaded ID proofs are correct. All the information provided will be
              verified!
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
