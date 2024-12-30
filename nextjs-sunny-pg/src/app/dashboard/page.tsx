"use client";
import useUserStore from "@/lib/store/userStore";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "react-js-loader";

export default function Dashboard() {
  const router = useRouter();
  const { userId, setRole, setStatus } = useUserStore();
  async function getUserInfo() {
    const { data, error } = await supabase
      .from("Tennants")
      .select("*")
      .eq("uid", userId)
      .single();
    if (error) {
      console.log(error);
      router.push("/");
    }
    if (data) {
      setRole(data?.role);
      setStatus(data?.status);
      data?.role === "admin"
        ? router.push("admin-dashboard/admin-dash")
        : router.push("user-dashboard");
    }
  }

  useEffect(() => {
    if (userId) {
      getUserInfo();
    } else {
      router.push("login");
    }
  }, []);

  return (
    <Loader
      type="hourglass"
      bgColor={"#7c3ab3"}
      color={"#828282"}
      title={"Loading..."}
      size={60}
    />
  );
}
