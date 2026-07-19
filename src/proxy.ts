import { NextRequest, NextResponse } from "next/server";

// Gate /admin pages on the presence of the admin token cookie.
// Real authorization happens in the API (every admin call needs a valid JWT);
// this only keeps logged-out visitors from seeing the shell.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("aksharum_admin_token")?.value;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  if (pathname === "/admin/login" && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
