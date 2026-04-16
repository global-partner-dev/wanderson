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
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;
    const isAdminOrStaff = role === "admin" || role === "staff";

    let redirectTo: string | null = null;

    if (pathname === "/login" || pathname === "/signup") {
      redirectTo = isAdminOrStaff ? "/admin" : "/portal";
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
