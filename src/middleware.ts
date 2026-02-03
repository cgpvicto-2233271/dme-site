import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // IMPORTANT: on vise uniquement riot.txt
  // Si l'URL contient des doubles slash dans le path, on normalise et on REWRITE (pas redirect)
  if (url.pathname.includes("riot.txt") && url.pathname.includes("//")) {
    url.pathname = "/riot.txt";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};