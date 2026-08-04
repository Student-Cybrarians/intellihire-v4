import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { config } from "@/lib/config";
import { randomToken, sha256, pkceChallenge } from "./crypto";
const COOKIE = "ih_oauth";
type OAuthState = {
  state: string;
  nonce: string;
  verifier: string;
  redirectTo: string;
  exp: number;
};
function sign(payload: string) {
  return createHmac("sha256", config.SESSION_SECRET ?? "test-secret-test-secret-test-secret-123")
    .update(payload)
    .digest("base64url");
}
function pack(data: OAuthState) {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}
function unpack(value: string): OAuthState {
  const [payload, mac] = value.split(".");
  if (!payload || !mac) throw new Error("INVALID_STATE");
  const expected = sign(payload);
  if (!timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) throw new Error("INVALID_STATE");
  return JSON.parse(Buffer.from(payload, "base64url").toString()) as OAuthState;
}
export function beginOAuthState(redirectTo: string) {
  const verifier = randomToken(64);
  const data: OAuthState = {
    state: randomToken(32),
    nonce: randomToken(32),
    verifier,
    redirectTo,
    exp: Date.now() + 10 * 60_000,
  };
  cookies().set(COOKIE, pack(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return { ...data, codeChallenge: pkceChallenge(verifier) };
}
export function consumeOAuthState(state: string) {
  const raw = cookies().get(COOKIE)?.value;
  cookies().delete(COOKIE);
  if (!raw) throw new Error("INVALID_STATE");
  const data = unpack(raw);
  if (data.exp < Date.now() || sha256(data.state) !== sha256(state))
    throw new Error("INVALID_STATE");
  return data;
}
