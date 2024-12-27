"use client";
import { useState, useEffect } from "react";
import { FaBed, FaPen } from "react-icons/fa";
import { supabase } from "@/lib/supabase"; // Ensure proper supabaseClient setup
import Loader from "react-js-loader";

interface Occupancy {
  id: number;
  max_tennant: number;
  type: string;
  occupancy: number;
}

interface Tennant {
  name: string;
  room_number: number;
}

const RoomBoxContainer = () => {
  const [occupancies, setOccupancies] = useState<Occupancy[]>([]);
  const [tennants, setTennants] = useState<Tennant[]>([]);
  const [editingRoom, setEditingRoom] = useState<number | null>(null);
  const [newMaxTenant, setNewMaxTenant] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state

  // Fetch Occupancy and Tennant Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: occupancyData, error: occupancyError } = await supabase
        .from("Occupancy")
        .select("*");
      if (occupancyError) {
        console.error(occupancyError);
      } else {
        setOccupancies(occupancyData?.sort((a, b) => a.id - b.id) || []);
      }

      const { data: tennantData, error: tennantError } = await supabase
        .from("Tennants")
        .select("name, room_number")
        .eq("status", "Active");
      if (tennantError) {
        console.error(tennantError);
      } else {
        setTennants(tennantData);
      }

      setLoading(false); // Set loading to false after both data sets are fetched
    };
    fetchData();
  }, []); // Empty dependency array ensures this runs only once

  // Handle max_tennant update
  const handleUpdateMaxTenant = async (roomId: number) => {
    if (newMaxTenant === null || newMaxTenant < 1 || newMaxTenant > 4) {
      alert("Max Tenant value is invalid");
      return;
    }

    // Find the room's current occupancy
    const roomOccupancy = occupancies.find((room) => room.id === roomId)?.occupancy;

    // Check if the new max_tennant is greater than the current occupancy
    if (roomOccupancy && newMaxTenant < roomOccupancy) {
      alert("Cannot set max_tennant less than current occupancy.");
      return;
    }

    const { error } = await supabase
      .from("Occupancy")
      .update({ max_tennant: newMaxTenant }) // Update the max_tennant column
      .eq("id", roomId);

    if (error) {
      console.error("Error updating max_tennant:", error);
    } else {
      setOccupancies((prev) =>
        prev.map((room) =>
          room.id === roomId ? { ...room, max_tennant: newMaxTenant } : room
        )
      );
    }
    setEditingRoom(null);
  };

  // Get tennants for a specific room
  const getRoomTennants = (roomId: number) => {
    return tennants.filter((tennant) => tennant.room_number == roomId);
  };

  return (
    <div className="mx-6">
      <div className="flex items-center justify-end mt-3">
        <h3 className="text-xl font-semibold">Hostel Occupancy</h3>
      </div>
      <hr className="my-3" />
      {!loading ? (
        <div>
          <div className="flex flex-wrap gap-4 justify-start max-h-[75vh] overflow-y-auto">
            {occupancies.map((occupancy) => (
              <div
                key={occupancy.id}
                className="flex flex-col bg-gray-100 p-2 rounded-lg shadow-lg max-w-[300px] w-full transform transition-transform duration-300 hover:scale-105"
              >
                {/* Room Number */}
                <h3 className="text-2xl font-bold">{occupancy.id}</h3>
                <hr className="mt-1" />
                {/* Bed Icons and Tennant Names side by side */}
                <div className="gap-4 justify-start mt-2">
                  {[...Array(occupancy.max_tennant)].map((_, index) => (
                    <div key={index} className="flex items-center gap-2 ml-3">
                      <FaBed
                        className={`text-2xl ${
                          index < occupancy.occupancy
                            ? "text-purple-500"
                            : "text-gray-300"
                        }`}
                      />
                      <span className="text-md font-bold text-gray-700">
                        {getRoomTennants(occupancy.id)[index]?.name || ""}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Edit Max Tenant */}
                <div className="absolute top-2 right-2">
                  {editingRoom === occupancy.id ? (
                    <input
                      type="number"
                      value={newMaxTenant || occupancy.max_tennant}
                      min="1"
                      onChange={(e) => setNewMaxTenant(Number(e.target.value))}
                      className="w-16 p-1 rounded border border-gray-300"
                    />
                  ) : (
                    <button
                      onClick={() => {
                        setEditingRoom(occupancy.id);
                        setNewMaxTenant(occupancy.max_tennant);
                      }}
                      className="text-gray-500 hover:text-blue-500 flex items-center"
                    >
                      <FaPen />
                    </button>
                  )}
                </div>

                {/* Save and Cancel Buttons */}
                {editingRoom === occupancy.id && (
                  <div className="mt-2 flex justify-center gap-2">
                    <button
                      onClick={() => handleUpdateMaxTenant(occupancy.id)}
                      className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingRoom(null); // Cancels the edit mode
                        setNewMaxTenant(occupancy.max_tennant); // Resets the max_tennant input
                      }}
                      className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div role="status" className="flex items-center justify-center h-[70vh]">
          <Loader
            type="hourglass"
            bgColor={"#7c3ab3"}
            color={"#828282"}
            title={"Loading..."}
            size={60}
          />
        </div>
      )}
    </div>
  );
};

export default RoomBoxContainer;
