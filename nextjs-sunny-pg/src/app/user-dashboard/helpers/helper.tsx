import { supabase } from "@/lib/supabase";
import { compressImage } from "./compressImage";

type PhotoType = "profile" | "adhaarFront" | "adhaarBack" | "alternateId";

const fieldMap: Record<PhotoType, string> = {
  profile: "profileUrl",
  adhaarFront: "adhaarFrontUrl",
  adhaarBack: "adhaarBackUrl",
  alternateId: "otherIdUrl",
};

export const deleteAllFiles = async (bucketName: string, pathName: string) => {
  try {
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list(pathName, { limit: 10 });

    if (listError) throw listError;

    if (files?.length === 0) return;

    const filePaths = files.map((file) => `${pathName}${file.name}`);

    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove(filePaths);

    if (deleteError) throw deleteError;
  } catch (error) {
    console.error("Error deleting files:", error);
  }
};

export const uploadPhoto = async (
  userId: string | null,
  pathName: string,
  type: string,
  file: any
) => {
  const fileName = `${userId}-${type} -${file.name}`;
  const filePath = `${pathName}${fileName}`;

  try {
    await deleteAllFiles("photo-ids", pathName);

    const { error: uploadError } = await supabase.storage
      .from("photo-ids")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Error uploading photo:", uploadError);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("photo-ids")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData?.publicUrl;
    if (!publicUrl) return null;

    const { data: photoData, error: photoError } = await supabase
      .from("PhotoIds")
      .select("uid")
      .eq("uid", userId);

    if (photoError) {
      console.error("Error checking existing photo data:", photoError);
      return null;
    }

    const columnMap: Record<string, string> = {
      profile: "profileUrl",
      adhaarFront: "adhaarFrontUrl",
      adhaarBack: "adhaarBackUrl",
      alternateId: "otherIdUrl",
    };

    const column = columnMap[type];
    if (!column) return null;

    const updateOrInsert = photoData?.length
      ? supabase
          .from("PhotoIds")
          .update({ [column]: publicUrl })
          .eq("uid", userId)
      : supabase.from("PhotoIds").insert({ uid: userId, [column]: publicUrl });

    await updateOrInsert;

    return publicUrl;
  } catch (error) {
    console.error("Unexpected error during photo upload:", error);
    return null;
  }
};
