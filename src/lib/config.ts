import { z } from "zod";
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  API_URL: z.string().url().optional(),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().url().optional(),
  SESSION_SECRET: z.string().min(32).optional(),
  NVIDIA_API_KEY_NEMOTRON_VL_12B: z.string().optional(),
  NVIDIA_API_KEY_LLAMA_NEMOTRON_VL_8B: z.string().optional(),
  NVIDIA_API_KEY_NEMOTRON_9B: z.string().optional(),
  NVIDIA_BASE_URL: z.string().url().default("https://integrate.api.nvidia.com/v1"),
  AI_DAILY_REQUEST_QUOTA: z.coerce.number().int().positive().default(500),
  AI_TIMEOUT_MS: z.coerce.number().int().positive().default(30000),
});
export const config = schema.parse(process.env);
export function assertAuthConfig() {
  const missing = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REDIRECT_URI",
    "SESSION_SECRET",
  ].filter((k) => !process.env[k]);
  if (missing.length && config.NODE_ENV !== "test")
    throw new Error(`Missing auth configuration: ${missing.join(", ")}`);
}
