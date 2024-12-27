"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Loader from "react-js-loader";
import { FaUsers } from "react-icons/fa";

const TennantsCard = () => {
  const [activeTennants, setActiveTennants] = useState<number>(0);
  const [vacancies, setVacancies] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchTennantsAndVacancies();
  }, []);

  const fetchTennantsAndVacancies = async () => {
    setLoading(true);
    try {
      const { data: tennantsData, error: tennantsError } = await supabase
        .from("Tennants")
        .select("uid")
        .eq("status", "Active");

      const { data: occupancyData, error: occupancyError } = await supabase
        .from("Occupancy")
        .select("id, max_tennant, occupancy");

      if (tennantsError || occupancyError) {
        console.error("Error fetching data:", tennantsError || occupancyError);
        setLoading(false);
        return;
      }

      const totalVacancies = occupancyData.reduce(
        (sum, room) => sum + (room.max_tennant - room.occupancy),
        0
      );

      setActiveTennants(tennantsData.length);
      setVacancies(totalVacancies);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-2 mt-10 bg-white shadow-md rounded-lg p-4 w-full max-w-md mx-auto">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader
            type="hourglass"
            bgColor={"#7c3ab3"}
            color={"#828282"}
            title={"Loading..."}
            size={60}
          />
        </div>
      ) : (
        <>
          <div className="flex flex-row items-center">
            <FaUsers className="text-blue-600 text-4xl mr-2" />
            <div>
              <div className="text-lg text-gray-700 font-semibold -mb-1">
                Occupancy
              </div>
              <div className="text-sm text-gray-500">as of today</div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-3xl font-bold">
              {activeTennants} <span className="text-sm font-medium">Active</span>
            </div>
            <div className="h-6 border-l border-gray-300 mx-4"></div>
            <div className="text-3xl font-bold">
              {vacancies} <span className="text-sm font-medium">Vacancies</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TennantsCard;
