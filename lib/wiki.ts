/**
 * Seam 2 — the controlled knowledge base the governed assistant answers from.
 *
 * The assistant answers ONLY from `content/seam2_knowledge_base.json`. Each
 * entry has `topics` (match terms), `question_intents` (what a visitor would
 * type), and a canonical `answer` in the brand voice. Pricing gives the
 * structure with no hard numbers; engine internals stay general.
 *
 * Retrieval here is INTENT-AWARE, not bag-of-words: it weights whole-phrase
 * topic hits and question-intent overlap, and it deliberately does NOT match
 * on the answer text. That fixes the old failure where "how much does it cost"
 * matched the word "cost" inside "lower compute cost".
 *
 * SEAM 2 (option B, the real one): when ANTHROPIC_API_KEY is set, app/api/chat
 * passes `groundingContext()` to a model with a strict "answer only from this"
 * instruction. The model reads meaning and picks the right entry. Retrieval
 * below stays as the zero-config fallback and as the source-attribution hint.
 */

import kb from "@/content/seam2_knowledge_base.json";

export interface KbEntry {
  id: string;
  topics: string[];
  question_intents: string[];
  answer: string;
}

export const FALLBACK: string = kb.fallback;
export const ENTRIES: KbEntry[] = kb.entries as KbEntry[];

// Human label for the "Grounded on:" attribution line in the chat UI.
function labelFor(id: string): string {
  return id
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const STOP = new Set([
  "the", "a", "an", "is", "it", "do", "does", "you", "your", "we", "our", "to",
  "of", "and", "or", "for", "on", "in", "with", "how", "what", "this", "that",
  "are", "can", "i", "me", "my", "us", "be", "if", "so", "just",
]);

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function contentTokens(s: string): Set<string> {
  return new Set(
    normalize(s)
      .split(" ")
      .filter((t) => t.length > 2 && !STOP.has(t)),
  );
}

/**
 * Score an entry against the query. Whole-phrase topic matches dominate,
 * single-word topics count less, and question-intent overlap adds signal.
 */
function score(entry: KbEntry, rawQuery: string): number {
  const q = " " + normalize(rawQuery) + " ";
  const qTokens = contentTokens(rawQuery);
  let s = 0;

  for (const topic of entry.topics) {
    const t = normalize(topic);
    if (t.includes(" ")) {
      // Phrase topic, e.g. "how much", "what do you charge" — strong signal.
      if (q.includes(" " + t + " ")) s += 4;
    } else if (qTokens.has(t)) {
      s += 2;
    }
  }

  for (const intent of entry.question_intents) {
    const iTokens = contentTokens(intent);
    let overlap = 0;
    iTokens.forEach((t) => {
      if (qTokens.has(t)) overlap += 1;
    });
    s += overlap * 0.75;
  }

  return s;
}

// Below this, we treat the match as "nothing fits" and return the fallback.
const MIN_SCORE = 1.5;

/** Top-k entries for a query (used to ground the model and to attribute). */
export function retrieve(query: string, k = 3): KbEntry[] {
  return ENTRIES.map((e) => ({ e, s: score(e, query) }))
    .filter((x) => x.s >= MIN_SCORE)
    .sort((a, b) => b.s - a.s)
    .slice(0, k)
    .map((x) => x.e);
}

/**
 * Default (zero-config) answer engine: return the single best entry's answer,
 * or the fallback when nothing clears the threshold. Never blends entries, so
 * answers stay canonical and on-message.
 */
export function groundedAnswer(query: string): { answer: string; sources: string[] } {
  const hits = retrieve(query, 1);
  if (hits.length === 0) {
    return { answer: FALLBACK, sources: [] };
  }
  return { answer: hits[0].answer, sources: [labelFor(hits[0].id)] };
}

/** Soft attribution label for the top match (used in model mode too). */
export function topLabel(query: string): string[] {
  const hits = retrieve(query, 1);
  return hits.length ? [labelFor(hits[0].id)] : [];
}

/**
 * The full knowledge base rendered as grounding context for the model (Seam 2
 * option B). The model is instructed to answer ONLY from this.
 */
export function groundingContext(): string {
  const blocks = ENTRIES.map(
    (e) => `[${e.id}] (asks: ${e.question_intents.join(" / ")})\n${e.answer}`,
  );
  return (
    "KNOWLEDGE BASE (answer only from these entries):\n\n" +
    blocks.join("\n\n") +
    `\n\nFALLBACK (use verbatim if nothing fits): ${FALLBACK}`
  );
}
