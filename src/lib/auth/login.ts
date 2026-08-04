import { prisma } from "@/lib/db/prisma";
import { GoogleClaims } from "./google";
import { createSession } from "./session";
import { logSecurity } from "@/lib/security/logging";
export async function loginWithGoogleClaims(claims: GoogleClaims) {
  const now = new Date();
  const user = await prisma.user.upsert({
    where: { provider_googleSub: { provider: "GOOGLE", googleSub: claims.sub } },
    create: {
      googleSub: claims.sub,
      email: claims.email,
      emailVerified: claims.email_verified,
      name: claims.name,
      avatarUrl: claims.picture,
      provider: "GOOGLE",
      role: "USER",
      status: "ACTIVE",
      lastLoginAt: now,
      lastActivityAt: now,
      profile: { create: { displayName: claims.name, avatarUrl: claims.picture } },
    },
    update: {
      email: claims.email,
      emailVerified: claims.email_verified,
      name: claims.name,
      avatarUrl: claims.picture,
      lastLoginAt: now,
      lastActivityAt: now,
    },
  });
  if (user.status !== "ACTIVE" || user.deletedAt) {
    await prisma.loginHistory.create({
      data: { userId: user.id, success: false, failureReason: "ACCOUNT_NOT_ACTIVE" },
    });
    throw new Error("ACCOUNT_NOT_ACTIVE");
  }
  await prisma.loginHistory.create({ data: { userId: user.id, success: true } });
  await createSession(user.id);
  logSecurity("auth.login.success", { userId: user.id, provider: "GOOGLE" });
  return user;
}
