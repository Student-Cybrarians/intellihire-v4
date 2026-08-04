import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "IntelliHire | AI-Based Placement Trainer",
  description: "Train Smart. Perform Better. Get Placed.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
