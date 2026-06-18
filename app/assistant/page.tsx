import type { Metadata } from "next";
import { GovernedAssistant } from "@/components/GovernedAssistant";

// Standalone, chrome-less route for embedding the governed assistant in an
// iframe (no site nav/footer). Same component as the homepage section.
// Noindex so it doesn't compete with the homepage for the same content.
export const metadata: Metadata = {
  title: "Gatekeeper — the governed assistant",
  robots: { index: false, follow: false },
};

export default function AssistantEmbedPage() {
  return <GovernedAssistant />;
}
