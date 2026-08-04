export function safeRedirectPath(value: string | null | undefined): string {
  if (!value) return "/dashboard";
  try {
    if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return value;
    const url = new URL(value);
    return url.origin === process.env.APP_URL
      ? `${url.pathname}${url.search}${url.hash}`
      : "/dashboard";
  } catch {
    return "/dashboard";
  }
}
