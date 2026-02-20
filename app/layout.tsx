import type { Metadata } from "next";
import "./globals.css";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Hamza Ayaz — Product Designer",
  description: "Product & UX Designer focused on clarity, systems, and reducing complexity in real products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Work", link: "#work" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <html lang="en">
      <body>
        <FloatingNav navItems={navItems} />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
