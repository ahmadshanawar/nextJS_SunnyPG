import { useRouter } from "next/router";
import { supabase } from "./supabase";

export const restoreSession = async () => {
  const storedSession = localStorage.getItem("supabaseSession");
  if (storedSession) {
    const session = JSON.parse(storedSession);
    // Validate or restore the session with Supabase
    const { data, error } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    if (data?.session) {
      console.log("Session restored:", data.session);
      return true;
    } else if (error) {
      console.error("Failed to restore session:", error.message);
      localStorage.removeItem("supabaseSession");
      return false;
    }
  } else {
    return false;
  }
};
