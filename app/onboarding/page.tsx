import type { Metadata } from "next";
import { Onboarding } from "@/components/Onboarding";

// Standalone, chrome-less route for embedding the onboarding configurator in
// an iframe (no site nav/footer). Same component as the homepage section.
// Noindex so it doesn't compete with the homepage for the same content.
export const metadata: Metadata = {
  title: "Gatekeeper — begin onboarding",
  robots: { index: false, follow: false },
};

export default function OnboardingEmbedPage() {
  return <Onboarding />;
}
