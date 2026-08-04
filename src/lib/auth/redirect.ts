export function safeRedirectPath(value: string | null | undefined): string {
  if (!value) return "/dashboard";
  try {
    if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return value;
    const url = new URL(value);
    const appOrigin = process.env.APP_URL ? new URL(process.env.APP_URL).origin : "";
    return appOrigin && url.origin === appOrigin
      ? `${url.pathname}${url.search}${url.hash}`
      : "/dashboard";
  } catch {
    return "/dashboard";
  }
}
