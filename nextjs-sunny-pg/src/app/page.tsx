"use client";
import { supabase } from "@/lib/supabase";
import { LandingPage } from "./components/LandingPage";
import { useEffect } from "react";
import { restoreSession } from "@/lib/sessions";

export default function Home() {
  useEffect(() => {
    restoreSession();
  }, []);
  return (
    <div>
      <LandingPage />
    </div>
  );
}
