import { createHash, randomBytes } from "crypto";
export const randomToken = (bytes = 32) => randomBytes(bytes).toString("base64url");
export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
export const pkceChallenge = (verifier: string) =>
  createHash("sha256").update(verifier).digest("base64url");
