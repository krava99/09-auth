import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshSession } from "@/lib/api/serverApi";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivatePage =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  if (!accessToken && refreshToken) {
    try {
      const { newAccessToken, newRefreshToken } = await refreshSession(
        refreshToken
      );

      if (newAccessToken && newRefreshToken) {
        const response = NextResponse.next();
        response.cookies.set("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
          path: "/",
        });
        response.cookies.set("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: true,
          path: "/",
        });
        return response;
      }
    } catch {
      const loginUrl = new URL("/sign-in", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (!accessToken && !refreshToken && isPrivatePage) {
    const loginUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (accessToken && isAuthPage) {
    const profileUrl = new URL("/profile", request.url);
    return NextResponse.redirect(profileUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/profile/:path*", "/notes/:path*"],
};
