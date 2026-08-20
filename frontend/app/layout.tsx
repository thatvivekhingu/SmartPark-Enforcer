import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartPark — Enforcement Dashboard",
  description: "AI-powered parking enforcement command center",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-app-bg text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
