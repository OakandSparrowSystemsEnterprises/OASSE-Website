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

  // Onboarding requires a company email — reject free/personal inboxes
  // (the client enforces this too; this is defense in depth).
  const FREE_EMAIL_DOMAINS = new Set([
    "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "ymail.com",
    "hotmail.com", "hotmail.co.uk", "outlook.com", "live.com", "msn.com",
    "aol.com", "icloud.com", "me.com", "mac.com", "proton.me", "protonmail.com",
    "pm.me", "gmx.com", "gmx.net", "mail.com", "yandex.com", "zoho.com",
    "hey.com", "fastmail.com", "tutanota.com", "qq.com", "163.com",
  ]);
  const m = /^[^\s@]+@([^\s@]+\.[^\s@]+)$/.exec(lead.email.trim().toLowerCase());
  if (!m || FREE_EMAIL_DOMAINS.has(m[1])) {
    return NextResponse.json(
      { error: "a company email is required (personal inboxes are not accepted)" },
      { status: 400 },
    );
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
