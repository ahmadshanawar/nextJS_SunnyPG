import TennantCard from "@/app/components/tennant-card";
import { FaFilter } from "react-icons/fa";

import { FaArrowUpWideShort } from "react-icons/fa6";

export default function Tennants() {
  return (
    <>
      <div className="mt-4 mx-4">
        <div className="flex justify-between">
          <div className="mx-2 my-2 text-bold text-xl text-gray-800">Tennants</div>
          <div className="flex justify-end items-center">
            <button className="bg-gray-100 rounded-md py-1 hover:bg-gray-300 mr-2">
              <FaArrowUpWideShort className="mx-2 text-3xl text-gray-700" />
            </button>
            <button className="bg-gray-100 rounded-md py-2 hover:bg-gray-300">
              <FaFilter className="mx-2 text-2xl text-gray-700" />
            </button>
          </div>
        </div>
        <hr className="h-px my-2 bg-gray-200 border-0" />
      </div>
      <div>
        <TennantCard />
      </div>
    </>
  );
}
