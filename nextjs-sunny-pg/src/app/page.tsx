"use client";
import { LandingPage } from "./components/LandingPage";
import { useEffect } from "react";
import { restoreSession } from "@/lib/sessions";
import useUserStore from "@/lib/store/userStore";

export default function Home() {
  const { userId } = useUserStore();
  useEffect(() => {
    if (userId) restoreSession();
  }, []);
  return (
    <div>
      <LandingPage />
    </div>
  );
}
