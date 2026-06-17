import { NextRequest, NextResponse } from "next/server";

/**
 * Onboarding lead capture (step 4 of the on-site flow).
 *
 * Default: validate and log the lead server-side. Set ONBOARDING_WEBHOOK_URL
 * in Vercel to forward leads to a CRM, Zapier, or Slack incoming webhook.
 * The scheduling link (step 5) is the conversion action and is handled on the
 * client via NEXT_PUBLIC_SCHEDULING_URL.
 */
export async function POST(req: NextRequest) {
  const lead = (await req.json().catch(() => null)) as Record<string, unknown> | null;

  if (!lead || typeof lead.email !== "string" || typeof lead.company !== "string") {
    return NextResponse.json({ error: "company and email are required" }, { status: 400 });
  }

  const payload = {
    receivedAt: new Date().toISOString(),
    industry: lead.industry ?? null,
    regime: lead.regime ?? null,
    volume: lead.volume ?? null,
    tools: lead.tools ?? null,
    name: lead.name ?? null,
    company: lead.company,
    email: lead.email,
    pack: lead.pack ?? null,
  };

  const webhook = process.env.ONBOARDING_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
    } catch {
      // Don't fail the prospect's flow if the webhook is down; we still log.
    }
  }

  // Always log so leads are recoverable from the deployment logs even without a CRM.
  console.log("[onboarding] lead captured:", JSON.stringify(payload));

  return NextResponse.json({ ok: true });
}
