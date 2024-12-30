import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    const { data, error } = await supabase.auth.getUser();

    if (!data?.user || error) {
      console.log("Middleware: No Session found or invalid token");
      return NextResponse.rewrite(new URL("/login", req.url));
    }

    const { data: userRoleData, error: userRoleError } = await supabase
      .from("Tennants")
      .select("role")
      .eq("uid", data.user.id)
      .single();

    if (userRoleError) {
      console.log("Middleware: Error fetching user role");
      return NextResponse.rewrite(new URL("/login", req.url));
    }

    const userRole = userRoleData.role;

    if (userRole === "admin") {
      // Allow access to admin routes
      return res;
    } else if (
      userRole === "user" &&
      req.nextUrl.pathname.startsWith("/user-dashboard")
    ) {
      // Allow access to user dashboard
      return res;
    } else {
      // Redirect to not authorized page
      console.log("Middleware: User is not authorized to access this page");
      return NextResponse.rewrite(new URL("/not-authorized", req.url));
    }
  } catch (error) {
    console.error("Middleware: Error fetching user", error);
    return NextResponse.rewrite(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/user-dashboard",
    "/admin-dashboard/tennants",
    "/admin-dashboard/admin-dash",
    "/admin-dashboard/occupancy",
    "/admin-dashboard/payments",
    "/admin-dashboard/expenses",
    "/user-dashboard",
  ],
};
