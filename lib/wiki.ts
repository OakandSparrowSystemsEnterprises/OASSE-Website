/**
 * Wiki grounding — the controlled source the assistant answers from.
 *
 * The master spec requires the assistant to answer from a controlled company
 * wiki so it speaks accurately about Gatekeeper and does not hallucinate
 * product claims. On the public build we ground on this curated knowledge
 * base (derived from the canonical spec). Answers are generated per query by
 * retrieving the most relevant entries — accurate, deterministic, no external
 * calls required.
 *
 * SEAM 2 (for the CTO): to make answers model-generated, chunk the external
 * wiki and ground a configured model on it (vector index or direct context
 * injection — the CTO's call). The retrieval below already returns the right
 * grounding chunks; /api/chat is where a model call would consume them.
 */

export interface WikiEntry {
  id: string;
  title: string;
  keywords: string[];
  body: string;
}

export const WIKI: WikiEntry[] = [
  {
    id: "what-is-gatekeeper",
    title: "What Gatekeeper is",
    keywords: ["what", "gatekeeper", "do", "product", "manager", "room", "overview", "about"],
    body: "Gatekeeper is the manager in the room for your AI. It checks every decision against your rules before the AI acts, and it keeps a sealed record of what happened. Governance sits outside the model, on your own network.",
  },
  {
    id: "problem",
    title: "The problem it solves",
    keywords: ["problem", "why", "risk", "liability", "paste", "screenshot", "lawsuit", "leak", "data"],
    body: "Employees paste sensitive data into AI tools every day, and one screenshot can become a lawsuit. Existing tools try to catch every bad phrasing after the fact, but that game cannot be won because the variations are infinite.",
  },
  {
    id: "govern-the-decision",
    title: "Govern the decision, not the string",
    keywords: ["how", "work", "decision", "string", "detection", "enforcement", "phrasing", "shift"],
    body: "Gatekeeper does not chase phrasings. Before any action runs it asks one bounded question: is this action permitted under the rule that applies. Detection chases infinite surface forms; enforcement asks one question.",
  },
  {
    id: "verdicts",
    title: "The verdict model",
    keywords: ["verdict", "green", "yellow", "red", "block", "outcome", "decision", "thermal"],
    body: "Every action gets a verdict before it executes and a sealed record after. GREEN means permitted, sealed and logged. YELLOW means modified or flagged before passing — for example a bulk request that needs scoping. RED means blocked before it ever executes — for example a request to expose a customer SSN.",
  },
  {
    id: "hash-chain",
    title: "How the record works: hash chaining, not blockchain",
    keywords: ["hash", "chain", "chaining", "blockchain", "record", "ledger", "tamper", "seal", "audit", "sha"],
    body: "Every decision is sealed with a cryptographic hash that includes the one before it. Change any record and the chain breaks visibly. No network, no token, no consensus overhead — just a tamper-evident ledger of every governed action. It is hash chaining, never blockchain.",
  },
  {
    id: "outcomes",
    title: "The three outcomes",
    keywords: ["outcome", "benefit", "cost", "compute", "water", "accountability", "save", "value"],
    body: "Three outcomes: lower compute cost, because the AI does not waste cycles on actions that should never run; saved water, because less wasted compute means less data-center cooling demand; and cryptographic accountability, a provable record of every decision for audit and compliance.",
  },
  {
    id: "why-now",
    title: "Why now",
    keywords: ["why", "now", "model", "pulled", "jailbreak", "timing", "frontier", "cloud"],
    body: "This month a frontier model was pulled across every cloud surface in an afternoon and workflows died mid-run. The lesson: safety that lives inside a model can be pulled or jailbroken out of it. Governance has to sit outside the model. That is what Gatekeeper is.",
  },
  {
    id: "architecture",
    title: "Architecture and trust",
    keywords: ["architecture", "cloud", "on-prem", "premises", "local", "network", "trust", "store", "prompt", "data", "where"],
    body: "Gatekeeper installs as a standalone executable on your own network. Your data never leaves your environment and there is no cloud in the decision path. The answer engine, the governance layer, and the sealed record all run locally. Prompts are never stored, sensitive data is masked on your side and excluded from records, and identifiers like SSNs never persist anywhere.",
  },
  {
    id: "compliance",
    title: "Compliance regimes",
    keywords: ["compliance", "hipaa", "financial", "legal", "ferpa", "regime", "policy", "pack", "regulation"],
    body: "Gatekeeper is built for your compliance regime — HIPAA, financial, and legal — with policy packs derived from the actual rules that govern your industry.",
  },
  {
    id: "engagement",
    title: "The 90-day pilot",
    keywords: ["pilot", "engagement", "90", "phase", "shadow", "trial", "expansion", "days", "timeline", "onboarding"],
    body: "The engagement is a 90-day, three-phase pilot. Shadow audit runs days 1 to 15, observation only. Guided trial runs days 16 to 45 with enforcement on. Expansion runs days 46 to 90. The onboarding fee funds setup and the client hardware, and a monthly floor follows.",
  },
  {
    id: "who-its-for",
    title: "Who it is for",
    keywords: ["who", "for", "customer", "industry", "legal", "insurance", "healthcare", "banking", "regulated"],
    body: "Gatekeeper is for decision-makers at regulated firms: legal, insurance, healthcare, and community banking — anyone who needs governance over employee AI use that they can prove.",
  },
  {
    id: "mission",
    title: "Mission",
    keywords: ["mission", "ethics", "ethical", "humanity", "steward", "philosophy", "purpose", "values"],
    body: "Oak & Sparrow is building the ethical infrastructure for the automated age, designed to govern AI and protect our humanity. The philosophy: we do not extract, we steward.",
  },
  {
    id: "deployment",
    title: "How it deploys",
    keywords: ["install", "deploy", "executable", "setup", "hardware", "standalone", "run"],
    body: "Gatekeeper installs as a standalone executable on the client's own network. During the shadow window the policy pack is built; enforcement begins at day 16 on the installed executable. Onboarding funds the hardware provisioning.",
  },
];

/** Score an entry against a query by keyword overlap. */
function scoreEntry(entry: WikiEntry, queryTokens: string[]): number {
  let score = 0;
  for (const token of queryTokens) {
    if (entry.keywords.includes(token)) score += 2;
    else if (entry.keywords.some((k) => k.includes(token) || token.includes(k))) score += 1;
    if (entry.title.toLowerCase().includes(token)) score += 1;
  }
  return score;
}

function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

/** Retrieve the top grounding entries for a query (Seam 2 input). */
export function retrieve(query: string, k = 3): WikiEntry[] {
  const tokens = tokenize(query);
  return WIKI.map((e) => ({ e, s: scoreEntry(e, tokens) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, k)
    .map((x) => x.e);
}

/**
 * Produce a grounded answer from the controlled source. Deterministic and
 * citation-backed: it stitches the most relevant wiki entries rather than
 * inventing claims. This is the default public-build answer engine.
 */
export function groundedAnswer(query: string): { answer: string; sources: string[] } {
  const hits = retrieve(query, 2);
  if (hits.length === 0) {
    return {
      answer:
        "I answer only from Oak & Sparrow's controlled wiki, so I will not guess. Try asking about what Gatekeeper does, the verdict model, hash chaining, the architecture, compliance, or the 90-day pilot.",
      sources: [],
    };
  }
  const answer = hits.map((h) => h.body).join(" ");
  return { answer, sources: hits.map((h) => h.title) };
}
