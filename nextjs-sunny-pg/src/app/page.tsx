"use client";
import { LandingPage } from "./components/LandingPage";
import { useEffect } from "react";
import { restoreSession } from "@/lib/sessions";
import { useRouter } from "next/navigation";
import useUserStore from "@/lib/store/userStore";

export default function Home() {
  const router = useRouter();
  const { setUserId, setRole, setStatus } = useUserStore();
  useEffect(() => {
    const result = restoreSession();
    if (!result) {
      setRole(null);
      setStatus(null);
      setUserId(null);
      router.push("/login");
    }
  }, []);
  return (
    <div>
      <LandingPage />
    </div>
  );
}
