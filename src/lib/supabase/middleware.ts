import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const publicPaths = ["/", "/login", "/signup", "/auth/callback", "/forgot-password", "/reset-password", "/terms", "/privacy", "/triage"];
  const isPublic = publicPaths.some(
    (p) => pathname === p || pathname.startsWith("/proposal/"),
  );

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  const needsRoleCheck =
    user &&
    (pathname === "/login" ||
      pathname === "/signup" ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/portal"));

  if (needsRoleCheck) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, staff_signup_requested, staff_approval_status")
      .eq("id", user.id)
      .single();

    const role = profile?.role;
    const isAdminOrStaff = role === "admin" || role === "staff";
    const staffRequested = profile?.staff_signup_requested === true;
    const staffStatus = profile?.staff_approval_status as
      | "none"
      | "pending"
      | "approved"
      | "rejected"
      | undefined;
    const staffNotApproved =
      staffRequested && staffStatus !== "approved";

    // Pending/rejected staff sign-up: deny access to either panel by signing
    // them out and bouncing back to /login with a status flag.
    if (staffNotApproved && (pathname.startsWith("/admin") || pathname.startsWith("/portal"))) {
      await supabase.auth.signOut();
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      url.searchParams.set(
        "status",
        staffStatus === "rejected" ? "staff_rejected" : "staff_pending",
      );
      return NextResponse.redirect(url);
    }

    let redirectTo: string | null = null;

    if (pathname === "/login" || pathname === "/signup") {
      // Don't auto-bounce unapproved staff into a panel they can't use.
      if (staffNotApproved) {
        redirectTo = null;
      } else {
        redirectTo = isAdminOrStaff ? "/admin" : "/portal";
      }
    } else if (pathname.startsWith("/admin") && !isAdminOrStaff) {
      redirectTo = "/portal";
    } else if (pathname.startsWith("/portal") && isAdminOrStaff) {
      redirectTo = "/admin";
    }

    if (redirectTo) {
      const url = request.nextUrl.clone();
      url.pathname = redirectTo;
      const redirectResponse = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
      return redirectResponse;
    }
  }

  return supabaseResponse;
}
