import { NextRequest, NextResponse } from "next/server";
import { consumeOAuthState } from "@/lib/auth/oauth-store";
import { exchangeCodeForTokens, verifyGoogleIdToken } from "@/lib/auth/google";
import { loginWithGoogleClaims } from "@/lib/auth/login";
import { safeRedirectPath } from "@/lib/auth/redirect";
import { logSecurity } from "@/lib/security/logging";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const appUrl = process.env.APP_URL ?? req.nextUrl.origin;
  try {
    const code = req.nextUrl.searchParams.get("code");
    const state = req.nextUrl.searchParams.get("state");
    if (!code || !state) throw new Error("MISSING_CODE_OR_STATE");
    const stored = consumeOAuthState(state);
    const tokens = await exchangeCodeForTokens(code, stored.verifier);
    const claims = await verifyGoogleIdToken(tokens.id_token, stored.nonce);
    await loginWithGoogleClaims(claims);
    return NextResponse.redirect(new URL(safeRedirectPath(stored.redirectTo), appUrl));
  } catch (error) {
    logSecurity("auth.login.failure", {
      reason: error instanceof Error ? error.message : "UNKNOWN",
    });
    return NextResponse.redirect(new URL(`/?auth=failed`, appUrl));
  }
}
