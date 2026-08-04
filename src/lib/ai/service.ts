import { NvidiaAIProvider } from "./nvidia-provider";
import { AIProvider, AIRequest } from "./types";
export class AIService {
  constructor(private readonly provider: AIProvider = new NvidiaAIProvider()) {}
  generate(req: AIRequest) {
    return this.provider.generate(req);
  }
  analyzeText(req: AIRequest) {
    return this.provider.analyzeText(req);
  }
  analyzeVision(req: AIRequest) {
    return this.provider.analyzeVision(req);
  }
  healthCheck() {
    return this.provider.healthCheck();
  }
}
export const aiService = new AIService();
