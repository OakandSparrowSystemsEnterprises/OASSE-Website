import { NextRequest, NextResponse } from "next/server";

/**
 * SEAM 1 — server side.
 *
 * Default: no live engine configured. We return `engine: false`, and the
 * client falls back to the in-browser demonstration verdict. The public site
 * works with zero configuration.
 *
 * Production: set GATEKEEPER_API_URL (and optionally GATEKEEPER_CLIENT_ID) in
 * the Railway service variables. This route then proxies the text to the live
 * Gatekeeper /evaluate endpoint and returns the real verdict, pack, and
 * invariants. The browser code does not change.
 */
export async function POST(req: NextRequest) {
  const { text } = (await req.json().catch(() => ({}))) as { text?: string };

  if (typeof text !== "string" || text.length === 0) {
    return NextResponse.json({ error: "text required" }, { status: 400 });
  }

  const apiUrl = process.env.GATEKEEPER_API_URL?.replace(/\/$/, "");
  if (!apiUrl) {
    // Signal the client to use the local demonstration classifier.
    return NextResponse.json({ engine: false });
  }

  try {
    const res = await fetch(`${apiUrl}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: text.slice(0, 500),
        client_id: process.env.GATEKEEPER_CLIENT_ID || "public-site",
        meta: "INPUT_SHIELD",
        platform: "oasse.com",
      }),
      // Keep the public page responsive even if the engine is slow.
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json({ engine: false, upstreamStatus: res.status });
    }

    const data = await res.json();
    // Normalize the engine response into our Verdict shape.
    return NextResponse.json({
      engine: true,
      thermal: data.thermal ?? "GREEN",
      verdict: data.verdict ?? "PASS",
      pack: data.pack ?? "Live engine",
      tags: data.tags ?? [],
      invariants: data.invariants ?? [],
      rationale: data.rationale ?? "Evaluated by the live Gatekeeper engine.",
      blocked: data.verdict === "BLOCK",
    });
  } catch {
    // Engine unreachable — degrade gracefully to the demonstration.
    return NextResponse.json({ engine: false });
  }
}
