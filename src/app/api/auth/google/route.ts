import { NextRequest, NextResponse } from "next/server";
import { assertAuthConfig } from "@/lib/config";
import { googleAuthorizeUrl } from "@/lib/auth/google";
import { beginOAuthState } from "@/lib/auth/oauth-store";
import { safeRedirectPath } from "@/lib/auth/redirect";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  assertAuthConfig();
  const redirectTo = safeRedirectPath(req.nextUrl.searchParams.get("redirectTo"));
  const state = beginOAuthState(redirectTo);
  return NextResponse.redirect(googleAuthorizeUrl(state));
}
