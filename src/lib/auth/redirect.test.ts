import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "./redirect";
describe("safeRedirectPath", () => {
  it("keeps relative protected routes", () =>
    expect(safeRedirectPath("/dashboard?x=1")).toBe("/dashboard?x=1"));
  it("blocks open redirects", () =>
    expect(safeRedirectPath("https://evil.test/pwn")).toBe("/dashboard"));
  it("blocks protocol-relative URLs", () =>
    expect(safeRedirectPath("//evil.test")).toBe("/dashboard"));
});
