import { AICapability } from "./types";

export const NVIDIA_MODELS: Record<
  AICapability,
  { model: string; envKey: string; supportsVision: boolean }
> = {
  reasoning: {
    model: "nvidia-nemotron-nano-9b-v2",
    envKey: "NVIDIA_API_KEY_NEMOTRON_9B",
    supportsVision: false,
  },
  text: {
    model: "Llama-3.1-Nemotron-Nano-VL-8B-v1",
    envKey: "NVIDIA_API_KEY_LLAMA_NEMOTRON_VL_8B",
    supportsVision: true,
  },
  vision: {
    model: "nemotron-nano-12b-v2-vl",
    envKey: "NVIDIA_API_KEY_NEMOTRON_VL_12B",
    supportsVision: true,
  },
};
