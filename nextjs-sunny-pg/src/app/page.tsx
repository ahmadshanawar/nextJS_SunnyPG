"use client";
import { LandingPage } from "./components/LandingPage";
import { useEffect } from "react";
import { restoreSession } from "@/lib/sessions";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const result = restoreSession();
    if (!result) {
      router.push("/login");
    }
  }, []);
  return (
    <div>
      <LandingPage />
    </div>
  );
}
