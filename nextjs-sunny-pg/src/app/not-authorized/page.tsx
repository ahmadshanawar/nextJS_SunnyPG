"use client";
import { useRouter } from "next/navigation";

const NotAuthorized = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          403 - Not Authorized
        </h1>
        <p className="text-gray-700 mb-6">
          You do not have permission to access this page.
        </p>
        <button
          onClick={handleGoBack}
          className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotAuthorized;
