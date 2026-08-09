import "@testing-library/jest-dom/vitest";
(process.env as Record<string, string | undefined>).NODE_ENV = "test";
process.env.APP_URL = "http://localhost:3000";
process.env.GOOGLE_CLIENT_ID = "test-client";
process.env.SESSION_SECRET = "test-secret-test-secret-test-secret-123";
