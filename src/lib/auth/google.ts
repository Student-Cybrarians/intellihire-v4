import { jwtVerify, createRemoteJWKSet } from "jose";
import { config } from "@/lib/config";
export type GoogleClaims = {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
  nonce?: string;
  iss: string;
  aud: string;
  exp: number;
};
const jwks = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
export function googleAuthorizeUrl(params: {
  state: string;
  nonce: string;
  codeChallenge: string;
}) {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: config.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: config.GOOGLE_REDIRECT_URI ?? "",
    response_type: "code",
    scope: "openid email profile",
    state: params.state,
    nonce: params.nonce,
    code_challenge: params.codeChallenge,
    code_challenge_method: "S256",
    prompt: "select_account",
    access_type: "online",
  }).toString();
  return url;
}
export async function exchangeCodeForTokens(code: string, verifier: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.GOOGLE_CLIENT_ID ?? "",
      client_secret: config.GOOGLE_CLIENT_SECRET ?? "",
      redirect_uri: config.GOOGLE_REDIRECT_URI ?? "",
      grant_type: "authorization_code",
      code,
      code_verifier: verifier,
    }),
  });
  if (!res.ok) throw new Error("GOOGLE_TOKEN_EXCHANGE_FAILED");
  return (await res.json()) as { id_token: string };
}
export async function verifyGoogleIdToken(
  idToken: string,
  expectedNonce: string,
): Promise<GoogleClaims> {
  const { payload } = await jwtVerify(idToken, jwks, {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience: config.GOOGLE_CLIENT_ID,
  });
  const claims = payload as unknown as GoogleClaims;
  if (claims.nonce !== expectedNonce) throw new Error("INVALID_NONCE");
  if (!claims.email_verified) throw new Error("UNVERIFIED_EMAIL");
  return claims;
}
