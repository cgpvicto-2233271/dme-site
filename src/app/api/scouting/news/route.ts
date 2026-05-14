import { NextRequest, NextResponse } from "next/server";
import { getNews, countNews } from "@/lib/scout/db";
import { verifyStaff } from "@/lib/scout/auth";
import { runJob } from "@/lib/scout/jobs";

export async function GET(req: NextRequest) {
  const authErr = await verifyStaff();
  if (authErr) return authErr;
  const { searchParams } = new URL(req.url);
  const [news, total] = await Promise.all([
    getNews({
      type:   searchParams.get("type")   ?? undefined,
      region: searchParams.get("region") ?? undefined,
      search: searchParams.get("q")      ?? undefined,
    }),
    countNews(),
  ]);
  return NextResponse.json({ ok: true, data: news, total });
}

export async function POST(req: NextRequest) {
  const authErr = await verifyStaff();
  if (authErr) return authErr;
  if (new URL(req.url).searchParams.get("action") === "refresh") {
    try {
      const result = await runJob("refresh_news");
      return NextResponse.json({ ok: true, ...result });
    } catch (e: unknown) {
      return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
    }
  }
  return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
}
