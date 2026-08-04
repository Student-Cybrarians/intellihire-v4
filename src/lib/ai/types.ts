export type AICapability = "reasoning" | "text" | "vision";
export type AIRequest = {
  capability: AICapability;
  prompt: string;
  imageUrl?: string;
  correlationId?: string;
};
export type AIResponse = { text: string; model: string; provider: string };
export interface AIProvider {
  generate(req: AIRequest): Promise<AIResponse>;
  analyzeText(req: AIRequest): Promise<AIResponse>;
  analyzeVision(req: AIRequest): Promise<AIResponse>;
  healthCheck(): Promise<{ ok: boolean; reason?: string }>;
}
