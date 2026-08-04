import { NextResponse } from "next/server";
import { getCurrentUser } from "./session";
export function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user)
    return { error: jsonError(401, "UNAUTHENTICATED", "Authentication is required.") } as const;
  if (user.status !== "ACTIVE")
    return { error: jsonError(403, "ACCOUNT_BLOCKED", "Account is not active.") } as const;
  return { user } as const;
}
export async function requireRole(...roles: string[]) {
  const auth = await requireAuth();
  if ("error" in auth) return auth;
  if (!roles.includes(auth.user.role))
    return { error: jsonError(403, "FORBIDDEN", "Insufficient role.") } as const;
  return auth;
}
export async function requirePermission(permission: string) {
  const auth = await requireAuth();
  if ("error" in auth) return auth;
  if (!auth.user.permissions.includes(permission))
    return { error: jsonError(403, "FORBIDDEN", "Missing permission.") } as const;
  return auth;
}
