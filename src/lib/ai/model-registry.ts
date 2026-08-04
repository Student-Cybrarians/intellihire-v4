import { AICapability } from "./types";
export const NVIDIA_MODELS: Record<
  AICapability,
  { model: string; envKey: string; supportsVision: boolean }
> = {
  reasoning: {
    model: "nvidia/nemotron-9b",
    envKey: "NVIDIA_API_KEY_NEMOTRON_9B",
    supportsVision: false,
  },
  text: {
    model: "nvidia/llama-nemotron-vl-8b",
    envKey: "NVIDIA_API_KEY_LLAMA_NEMOTRON_VL_8B",
    supportsVision: true,
  },
  vision: {
    model: "nvidia/nemotron-vl-12b",
    envKey: "NVIDIA_API_KEY_NEMOTRON_VL_12B",
    supportsVision: true,
  },
};
