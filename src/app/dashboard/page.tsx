import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }
  if (user.role === "ADMIN") {
    redirect("/admin");
  }
  return (
    <main style={{ padding: "2rem" }}>
      <h1>IntelliHire Dashboard</h1>
      <p>Welcome{user.name ? `, ${user.name}` : ""}. Your placement training workspace is ready.</p>
    </main>
  );
}
