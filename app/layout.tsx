import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "wgowleack8";

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
    { name: "Work", link: "/#work" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <html lang="en">
      <body>
        <FloatingNav navItems={navItems} />
        {children}
        <Analytics />
        <SpeedInsights />
        {clarityProjectId ? (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`if (window.location.hostname === "hamzaayaz.site" || window.location.hostname === "www.hamzaayaz.site") {
  (function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", ${JSON.stringify(clarityProjectId)});
}`}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
