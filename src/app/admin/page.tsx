import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
export default async function Admin() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }
  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  return (
    <main style={{ padding: "2rem" }}>
      <h1>IntelliHire Admin</h1>
      <p>Administrative workspace.</p>
    </main>
  );
}
