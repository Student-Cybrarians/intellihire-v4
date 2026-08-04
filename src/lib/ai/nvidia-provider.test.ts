import { describe, expect, it, vi } from "vitest";
import { NvidiaAIProvider } from "./nvidia-provider";
describe("NvidiaAIProvider", () => {
  it("reports missing credentials", async () => {
    const p = new NvidiaAIProvider();
    await expect(p.generate({ capability: "reasoning", prompt: "hi" })).rejects.toThrow(
      "AI_CREDENTIAL_MISSING",
    );
  });
  it("maps valid responses", async () => {
    process.env.NVIDIA_API_KEY_NEMOTRON_9B = "x";
    const fetcher = vi.fn(
      async () =>
        new Response(JSON.stringify({ choices: [{ message: { content: "ok" } }] }), {
          status: 200,
        }),
    );
    const p = new NvidiaAIProvider(fetcher as any);
    await expect(
      p.generate({ capability: "reasoning", prompt: "hi", correlationId: "c" }),
    ).resolves.toMatchObject({ text: "ok", provider: "nvidia" });
    delete process.env.NVIDIA_API_KEY_NEMOTRON_9B;
  });
  it("rejects invalid provider response", async () => {
    process.env.NVIDIA_API_KEY_NEMOTRON_9B = "x";
    const p = new NvidiaAIProvider(
      (async () => new Response(JSON.stringify({ choices: [] }), { status: 200 })) as any,
    );
    await expect(p.generate({ capability: "reasoning", prompt: "hi" })).rejects.toThrow(
      "AI_INVALID_RESPONSE",
    );
    delete process.env.NVIDIA_API_KEY_NEMOTRON_9B;
  });
});
