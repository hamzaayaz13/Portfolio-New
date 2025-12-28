import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FloatingNav } from "@/components/ui/floating-navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio - Scroll Expansion Hero",
  description: "Modern portfolio with scroll expansion hero component",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Case Study",
      link: "#work",
    },
    {
      name: "Contact Me",
      link: "/contact",
    },
  ];

  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <FloatingNav navItems={navItems} />
        {children}
      </body>
    </html>
  );
}


