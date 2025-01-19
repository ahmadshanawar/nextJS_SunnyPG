import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const useTennantsAndVacancies = () => {
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

  return { activeTennants, vacancies, loading };
};
