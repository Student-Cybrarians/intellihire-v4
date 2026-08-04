import { describe, expect, it, vi } from "vitest";
vi.mock("./session", () => ({
  getCurrentUser: vi.fn(async () => ({
    id: "u",
    email: "a@b.com",
    emailVerified: true,
    name: null,
    avatarUrl: null,
    role: "USER",
    status: "ACTIVE",
    provider: "GOOGLE",
    permissions: ["profile:read"],
  })),
}));
import { requirePermission, requireRole } from "./guards";
describe("authorization guards", () => {
  it("allows matching permissions", async () =>
    expect("user" in (await requirePermission("profile:read"))).toBe(true));
  it("denies missing roles", async () =>
    expect("error" in (await requireRole("ADMIN"))).toBe(true));
});
