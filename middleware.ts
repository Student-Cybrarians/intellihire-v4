import { NextRequest, NextResponse } from "next/server";
const protectedPrefixes = ["/dashboard", "/admin"];
export function middleware(req: NextRequest) {
  if (
    protectedPrefixes.some((p) => req.nextUrl.pathname.startsWith(p)) &&
    !req.cookies.get("ih_session")
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("redirectTo", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  const res = NextResponse.next();
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://accounts.google.com",
  );
  return res;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
