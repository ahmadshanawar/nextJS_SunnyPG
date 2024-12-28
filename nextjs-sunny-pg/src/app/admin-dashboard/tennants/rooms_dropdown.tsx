import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

interface Room {
  id: number;
  max_tennant: number;
  occupancy: number;
}

interface RoomDropdownProps {
  onRoomSelect: (roomId: number | null) => void;
  roomNumber: number | null;
}

const RoomDropdown: React.FC<RoomDropdownProps> = ({ onRoomSelect, roomNumber }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(roomNumber);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("Occupancy")
          .select("id, max_tennant, occupancy");

        if (error) {
          console.error("Error fetching rooms:", error.message);
          return;
        }
        if (data) {
          setRooms(data.sort((a, b) => a.id - b.id));
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomSelect = (roomId: number | null) => {
    setSelectedRoom(roomId);
    onRoomSelect(roomId); // Notify the parent component
  };

  return (
    <>
      {loading ? (
        <p className="mt-2 text-sm text-gray-500">Loading rooms...</p>
      ) : (
        <>
          <label className="block mb-1">Room Number</label>
          <select
            id="roomDropdown"
            className="mt-2 w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={selectedRoom ?? ""}
            onChange={(e) =>
              handleRoomSelect(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="" disabled>
              Choose a room
            </option>
            {rooms?.map((room) => (
              <option
                key={room.id}
                value={room.id}
                disabled={room.occupancy >= room.max_tennant} // Disable if occupancy is full
                className={
                  room.occupancy >= room.max_tennant
                    ? "bg-gray-300 text-gray-900"
                    : ""
                }
              >
                Room {room.id}
              </option>
            ))}
          </select>
        </>
      )}
    </>
  );
};

export default RoomDropdown;
