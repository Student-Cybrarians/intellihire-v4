import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { sha256 } from "@/lib/auth/crypto";
import { requireAuth } from "@/lib/auth/guards";
import { clearSessionCookie, SESSION_COOKIE } from "@/lib/auth/session";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  const session = await prisma.session.findFirst({
    where: { id: params.id, userId: auth.user.id, revokedAt: null },
    select: { id: true },
  });

  if (!session) {
    return NextResponse.json(
      { error: { code: "SESSION_NOT_FOUND", message: "Session not found." } },
      { status: 404 },
    );
  }

  await prisma.session.update({
    where: { id: session.id },
    data: { revokedAt: new Date(), revokeReason: "USER_REVOKED_DEVICE" },
  });

  const currentToken = cookies().get(SESSION_COOKIE)?.value;
  if (currentToken) {
    const current = await prisma.session.findUnique({
      where: { tokenHash: sha256(currentToken) },
      select: { id: true },
    });
    if (current?.id === session.id) clearSessionCookie();
  }

  return NextResponse.json({ ok: true });
}
