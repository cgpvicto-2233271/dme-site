import { NextRequest, NextResponse } from "next/server";
import { getLFTSignals, deactivateLFTSignal } from "@/lib/scout/db";
import { verifyStaff } from "@/lib/scout/auth";
import { runJob } from "@/lib/scout/jobs";

export async function GET(req: NextRequest) {
  const authErr = await verifyStaff();
  if (authErr) return authErr;
  const { searchParams } = new URL(req.url);
  const signals = await getLFTSignals({
    role:       searchParams.get("role")       ?? undefined,
    region:     searchParams.get("region")     ?? undefined,
    source:     searchParams.get("source")     ?? undefined,
    confidence: searchParams.get("confidence") ?? undefined,
  });
  return NextResponse.json({ ok: true, data: signals });
}

export async function POST(req: NextRequest) {
  const authErr = await verifyStaff();
  if (authErr) return authErr;
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "refresh") {
    try {
      const result = await runJob("refresh_lft");
      return NextResponse.json({ ok: true, ...result });
    } catch (e: unknown) {
      return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
    }
  }

  if (action === "dismiss") {
    const body = await req.json() as { id: number };
    await deactivateLFTSignal(body.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
}
