import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { randomToken, sha256 } from "./crypto";
import { ROLE_PERMISSIONS, AuthUser } from "./types";
export const SESSION_COOKIE = "ih_session";
const DAYS = 1000 * 60 * 60 * 24;
export const SESSION_TTL_MS = 14 * DAYS;
export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  };
}
export async function createSession(userId: string) {
  const token = randomToken(48);
  const h = headers();
  const userAgent = h.get("user-agent") ?? "unknown";
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? null;
  const fingerprint = sha256(`${userAgent}:${ip ?? ""}`);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const device = await prisma.device.upsert({
    where: { userId_fingerprintHash: { userId, fingerprintHash: fingerprint } },
    update: { lastSeenAt: new Date(), userAgent, ipAddress: ip },
    create: { userId, fingerprintHash: fingerprint, userAgent, ipAddress: ip },
  });
  await prisma.session.create({
    data: {
      userId,
      tokenHash: sha256(token),
      deviceId: device.id,
      userAgent,
      ipAddress: ip,
      expiresAt,
    },
  });
  cookies().set(SESSION_COOKIE, token, cookieOptions());
}
export function clearSessionCookie() {
  cookies().set(SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
}
export async function getCurrentSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: sha256(token) },
    include: { user: true, device: true },
  });
  if (!session || session.revokedAt || session.expiresAt < new Date() || session.user.deletedAt)
    return null;
  if (session.user.status !== "ACTIVE") return null;
  await prisma.session.update({ where: { id: session.id }, data: { lastSeenAt: new Date() } });
  await prisma.user.update({ where: { id: session.userId }, data: { lastActivityAt: new Date() } });
  return session;
}
export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getCurrentSession();
  if (!session) return null;
  const u = session.user;
  return {
    id: u.id,
    email: u.email,
    emailVerified: u.emailVerified,
    name: u.name,
    avatarUrl: u.avatarUrl,
    role: u.role,
    status: u.status,
    provider: u.provider,
    permissions: ROLE_PERMISSIONS[u.role as keyof typeof ROLE_PERMISSIONS],
  };
}
export async function revokeCurrentSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token)
    await prisma.session.updateMany({
      where: { tokenHash: sha256(token), revokedAt: null },
      data: { revokedAt: new Date(), revokeReason: "USER_LOGOUT" },
    });
  clearSessionCookie();
}
export async function revokeAllSessions(userId: string) {
  await prisma.session.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date(), revokeReason: "LOGOUT_ALL" },
  });
  clearSessionCookie();
}
