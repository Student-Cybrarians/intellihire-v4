
// src/test/setup.ts
import "@testing-library/jest-dom/vitest";

// 1️⃣ Create a mutable copy of the existing environment
process.env = {
  ...process.env,               // keep all existing env vars
  NODE_ENV: "test",             // force test mode
  APP_URL: "http://localhost:3000",
  GOOGLE_CLIENT_ID: "test-client",
  SESSION_SECRET: "test-secret-test-secret-test-secret-123",
};
