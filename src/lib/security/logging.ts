const SECRET_KEYS = [/token/i, /secret/i, /cookie/i, /authorization/i, /code/i, /api[_-]?key/i];

export function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        SECRET_KEYS.some((r) => r.test(k)) ? "[REDACTED]" : redact(v),
      ]),
    );
  }
  return value;
}

export function logSecurity(event: string, metadata: Record<string, unknown> = {}) {
  const redactedMetadata = redact(metadata) as Record<string, unknown>;
  console.info(
    JSON.stringify({ level: "info", event, ...redactedMetadata, at: new Date().toISOString() }),
  );
}
