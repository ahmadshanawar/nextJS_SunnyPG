import { FaPen } from "react-icons/fa";

export default function TennantCard() {
  return (
    <div className="w-screen h-auto overflow-x-auto px-4 box-border">
      <div className="flex space-x-4">
        <div className="min-w-[150px] max-w-[200px] w-full bg-white shadow-lg rounded-lg p-4 flex-shrink-0">
          <div className="w-full h-32 bg-gray-300 rounded-lg mb-4"></div>
          <h3 className="text-lg font-semibold text-center mb-2">John Doe</h3>
          <p className="text-sm text-gray-600 text-center">Software Developer</p>
        </div>
      </div>
    </div>
  );
}
