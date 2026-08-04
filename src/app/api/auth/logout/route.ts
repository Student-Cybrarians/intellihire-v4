import { NextResponse } from "next/server";
import { revokeCurrentSession } from "@/lib/auth/session";
import { logSecurity } from "@/lib/security/logging";
export async function POST() {
  await revokeCurrentSession();
  logSecurity("auth.logout", {});
  return NextResponse.json({ ok: true });
}
