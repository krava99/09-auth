import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value; // 👈 заміни 'token', якщо cookie має іншу назву
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivatePage =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  // 🔒 Якщо користувач неавторизований і хоче зайти на приватну сторінку
  if (!token && isPrivatePage) {
    const loginUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 🚫 Якщо користувач авторизований і відкриває сторінку входу чи реєстрації
  if (token && isAuthPage) {
    const profileUrl = new URL("/profile", request.url);
    return NextResponse.redirect(profileUrl);
  }

  return NextResponse.next();
}

// Вказуємо, які шляхи перевіряє middleware
export const config = {
  matcher: ["/sign-in", "/sign-up", "/profile", "/notes/:path*"],
};
