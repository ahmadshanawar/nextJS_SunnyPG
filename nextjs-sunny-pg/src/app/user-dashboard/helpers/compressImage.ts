import imageCompression from "browser-image-compression";

export const compressImage = async (
  file: File
): Promise<File | null | undefined> => {
  const options = {
    maxSizeMB: 0.1, // Maximum size in MB
    maxWidthOrHeight: 640, // Maximum width or height
    useWebWorker: true, // Use web worker for better performance
  };

  try {
    const compressedFile = await imageCompression(file, options);
    console.log("Compressed image:", compressedFile);
    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    return null;
  }
};
