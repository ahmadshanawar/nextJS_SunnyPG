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
    } else if (error) {
      console.error("Failed to restore session:", error.message);
      localStorage.removeItem("supabaseSession");
    }
  }
};

export const checkForSession = async () => {
  const storedSession = localStorage.getItem("supabaseSession");
  if (storedSession) {
    const session = JSON.parse(storedSession);
    if (session?.access_token) {
      return session;
    } else {
      console.log("No Session found");
      localStorage.removeItem("supabaseSession");
      return false;
    }
  } else {
    console.log("No User Session found");
    localStorage.removeItem("supabaseSession");
    return false;
  }
};
