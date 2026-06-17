import { NextRequest, NextResponse } from "next/server";
import { groundedAnswer, groundingContext, topLabel, FALLBACK } from "@/lib/wiki";

/**
 * The governed assistant's answer engine.
 *
 * Default (zero-config): intent-aware retrieval over the Seam 2 knowledge base
 * (lib/wiki.ts). Returns the single canonical answer for the matched intent,
 * or the fallback when nothing fits. No external calls, no hallucination.
 *
 * SEAM 2 (option B, recommended): set ANTHROPIC_API_KEY and answers become
 * model-generated, grounded on the FULL knowledge base with a strict
 * "answer only from this, never invent numbers" instruction. The model reads
 * the question's meaning, so phrasing varies but the content stays bounded to
 * the approved base. Governance verdicts remain deterministic and separate.
 */

const SYSTEM = [
  "You are the site assistant for Oak and Sparrow Systems Enterprises, the company behind Gatekeeper.",
  "Answer the visitor's question using ONLY the knowledge base below.",
  "If nothing in the base fits the question, reply with the FALLBACK line verbatim.",
  "Never invent pricing numbers, model names, version numbers, or rule counts. Pricing is structure-only; specific figures are confirmed on the onboarding call.",
  "Keep answers to two to four sentences, plain and precise, warm but not hyped. Do not use em dashes.",
  "When a visitor shows buying intent, invite them to begin onboarding or book the call.",
].join(" ");

async function modelAnswer(text: string, apiKey: string): Promise<string | null> {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.CHAT_MODEL || "claude-opus-4-8",
        max_tokens: 600,
        system: `${SYSTEM}\n\n${groundingContext()}`,
        messages: [{ role: "user", content: text }],
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const out = (data.content || [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("\n")
      .trim();
    return out || null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const { text } = (await req.json().catch(() => ({}))) as { text?: string };

  if (typeof text !== "string" || text.length === 0) {
    return NextResponse.json({ error: "text required" }, { status: 400 });
  }

  // SEAM 2 — model-grounded answers when configured.
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    const answer = await modelAnswer(text, apiKey);
    if (answer) {
      // Attribute to the closest entry as a hint; empty if truly nothing matched.
      const sources = answer.trim() === FALLBACK.trim() ? [] : topLabel(text);
      return NextResponse.json({ answer, sources, mode: "model-grounded" });
    }
    // Model unreachable — fall through to retrieval so the site never goes mute.
  }

  // Default — intent-aware retrieval over the knowledge base.
  const { answer, sources } = groundedAnswer(text);
  return NextResponse.json({ answer, sources, mode: "grounded-kb" });
}
