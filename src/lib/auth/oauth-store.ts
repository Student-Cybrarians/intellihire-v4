import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { config } from "@/lib/config";
import { pkceChallenge, randomToken, sha256 } from "./crypto";

const COOKIE = "ih_oauth";
const MAX_AGE_SECONDS = 600;

type OAuthState = {
  state: string;
  nonce: string;
  verifier: string;
  redirectTo: string;
  exp: number;
};

function sign(payload: string) {
  if (!config.SESSION_SECRET) throw new Error("MISSING_SESSION_SECRET");
  return createHmac("sha256", config.SESSION_SECRET).update(payload).digest("base64url");
}

function pack(data: OAuthState) {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function unpack(value: string): OAuthState {
  const separator = value.lastIndexOf(".");
  if (separator <= 0) throw new Error("INVALID_STATE");

  const payload = value.slice(0, separator);
  const mac = value.slice(separator + 1);
  const expected = sign(payload);
  const received = Buffer.from(mac);
  const expectedBuffer = Buffer.from(expected);

  if (received.length !== expectedBuffer.length || !timingSafeEqual(received, expectedBuffer)) {
    throw new Error("INVALID_STATE");
  }

  return JSON.parse(Buffer.from(payload, "base64url").toString()) as OAuthState;
}

export function beginOAuthState(redirectTo: string) {
  const verifier = randomToken(64);
  const data: OAuthState = {
    state: randomToken(32),
    nonce: randomToken(32),
    verifier,
    redirectTo,
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
  };

  cookies().set(COOKIE, pack(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });

  return { ...data, codeChallenge: pkceChallenge(verifier) };
}

export function consumeOAuthState(state: string) {
  const raw = cookies().get(COOKIE)?.value;
  cookies().delete(COOKIE);

  if (!raw) throw new Error("INVALID_STATE");

  const data = unpack(raw);
  if (data.exp < Date.now() || sha256(data.state) !== sha256(state)) {
    throw new Error("INVALID_STATE");
  }

  return data;
}
