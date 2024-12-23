import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    console.log("Middleware: No Session found");
    return NextResponse.rewrite(new URL("/login", req.url));
  }
  return res;
}

export const config = {
  matcher: [
    "/admin-dashboard/tennants",
    "/admin-dashboard/admin-dash",
    "/admin-dashboard/occupancy",
    "/user-dashboard",
  ],
};
