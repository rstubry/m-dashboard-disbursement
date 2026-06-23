import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isTokenValid } from "@/lib/jwt";

const PUBLIC_PATHS = ["/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (isPublic) {
    if (token && isTokenValid(token)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!token || !isTokenValid(token)) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    if (token) response.cookies.delete("token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
