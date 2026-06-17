import { NextRequest, NextResponse } from "next/server";
import { groundedAnswer, retrieve } from "@/lib/wiki";

/**
 * The answer engine endpoint.
 *
 * Default (public build): answers are produced by grounded retrieval over the
 * controlled company wiki (lib/wiki.ts). Accurate, deterministic, no external
 * calls, no hallucination — and honest, per the spec's footer.
 *
 * SEAM 2: to make answers model-generated, set ANTHROPIC_API_KEY (and
 * optionally CHAT_MODEL, default claude-opus-4-8). The retrieved wiki chunks
 * are the grounding context; wire the model call below. Everything else — the
 * governance gate, the hash chain, the chat flow — stays as built.
 */
export async function POST(req: NextRequest) {
  const { text } = (await req.json().catch(() => ({}))) as { text?: string };

  if (typeof text !== "string" || text.length === 0) {
    return NextResponse.json({ error: "text required" }, { status: 400 });
  }

  // --- SEAM 2: model-grounded answers (optional) -------------------------
  // const apiKey = process.env.ANTHROPIC_API_KEY;
  // if (apiKey) {
  //   const context = retrieve(text, 4).map((c) => `# ${c.title}\n${c.body}`).join("\n\n");
  //   // Call the configured model (CHAT_MODEL ?? "claude-opus-4-8"), instructing
  //   // it to answer ONLY from `context`. Return { answer, sources }.
  // }
  // -----------------------------------------------------------------------

  const { answer, sources } = groundedAnswer(text);
  return NextResponse.json({ answer, sources, mode: "grounded-wiki" });
}
