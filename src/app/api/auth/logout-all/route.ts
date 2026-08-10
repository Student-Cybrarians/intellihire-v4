import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { revokeAllSessions } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  await revokeAllSessions(auth.user.id);
  return NextResponse.json({ ok: true });
}
