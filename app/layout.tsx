import type { Metadata } from "next";
import "./globals.css";
import { positioning, company } from "@/content/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: `${company.product} — ${positioning.lead}`,
  description:
    "Gatekeeper governs your AI on your own network: it checks every decision against your rules before the AI acts, and keeps a sealed, tamper-evident record. For legal, insurance, healthcare, and community banking.",
  metadataBase: new URL("https://oakandsparrowsystemsenterprise.com"),
  openGraph: {
    title: `${company.product} — the manager in the room for your AI`,
    description:
      "Governance that sits outside the model, on your network. Verdict before every action; sealed record after.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

// Bare root layout (html/body only). Site chrome (nav/footer) is added by the
// (site) route group; the /assistant and /onboarding embed pages render
// chrome-less so they iframe cleanly.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

