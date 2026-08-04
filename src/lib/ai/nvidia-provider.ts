import { config } from "@/lib/config";
import { logSecurity } from "@/lib/security/logging";
import { NVIDIA_MODELS } from "./model-registry";
import { AIProvider, AIRequest, AIResponse } from "./types";
export class NvidiaAIProvider implements AIProvider {
  private used = 0;
  constructor(private readonly fetcher: typeof fetch = fetch) {}
  async healthCheck() {
    return {
      ok: Object.values(NVIDIA_MODELS).some((m) => Boolean(process.env[m.envKey])),
      reason: "credentials/configuration checked",
    };
  }
  generate(req: AIRequest) {
    return this.call(req);
  }
  analyzeText(req: AIRequest) {
    return this.call({ ...req, capability: req.capability ?? "text" });
  }
  analyzeVision(req: AIRequest) {
    return this.call({ ...req, capability: "vision" });
  }
  private async call(req: AIRequest): Promise<AIResponse> {
    if (this.used >= config.AI_DAILY_REQUEST_QUOTA) throw new Error("AI_QUOTA_EXCEEDED");
    const entry = NVIDIA_MODELS[req.capability];
    if (req.imageUrl && !entry.supportsVision) throw new Error("AI_CAPABILITY_UNSUPPORTED");
    const key = process.env[entry.envKey];
    if (!key) throw new Error("AI_CREDENTIAL_MISSING");
    this.used++;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.AI_TIMEOUT_MS);
    try {
      for (let attempt = 0; attempt < 3; attempt++) {
        const res = await this.fetcher(`${config.NVIDIA_BASE_URL}/chat/completions`, {
          method: "POST",
          signal: controller.signal,
          headers: {
            authorization: `Bearer ${key}`,
            "content-type": "application/json",
            "x-correlation-id": req.correlationId ?? crypto.randomUUID(),
          },
          body: JSON.stringify({
            model: entry.model,
            messages: [{ role: "user", content: req.prompt }],
            temperature: 0.2,
          }),
        });
        if (res.ok) {
          const json = (await res.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          const text = json.choices?.[0]?.message?.content;
          if (!text) throw new Error("AI_INVALID_RESPONSE");
          return { text, model: entry.model, provider: "nvidia" };
        }
        if (![408, 409, 425, 429, 500, 502, 503, 504].includes(res.status))
          throw new Error(`AI_REQUEST_FAILED_${res.status}`);
        await new Promise((r) => setTimeout(r, 250 * Math.pow(2, attempt)));
      }
      throw new Error("AI_RETRY_EXHAUSTED");
    } catch (e) {
      logSecurity("ai.provider.error", {
        reason: e instanceof Error ? e.message : "UNKNOWN",
        capability: req.capability,
      });
      throw e;
    } finally {
      clearTimeout(timeout);
    }
  }
}
