"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminUserDashboard() {
  const router = useRouter();
  useEffect(() => {
    router.push("/admin-dashboard");
  }, []);
  return <div></div>;
}
