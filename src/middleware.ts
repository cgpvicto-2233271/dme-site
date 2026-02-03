import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Normalise toutes les variantes vers /riot.txt, sans redirect
  if (url.pathname.includes("riot.txt")) {
    url.pathname = "/riot.txt";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Touche seulement riot.txt (et donc aussi //riot.txt)
  matcher: ["/:path*riot.txt"],
};