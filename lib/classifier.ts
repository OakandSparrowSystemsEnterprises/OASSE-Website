/**
 * Gatekeeper — governance classifier (public-build demonstration).
 *
 * HONESTY NOTE (locked by the master spec): on the public site the chat
 * ANSWERS are real, but the governance VERDICTS are a demonstration. This
 * module is a rules-based classifier that runs in the browser. It mirrors
 * the semantic tag extraction of the production engine (gatekeeper-engine.js)
 * so the verdicts shown are faithful to how the real engine behaves — but it
 * is NOT the engine. The footer says so plainly.
 *
 * SEAM 1 (for the CTO): `classifyInput` is the only function that changes to
 * make this production-real. Point it at the live Gatekeeper /evaluate
 * endpoint (see app/api/classify/route.ts) and the verdict, pack, and
 * invariants flow back unchanged. Everything downstream — the hash chain, the
 * side panel, the chat flow — stays exactly as built.
 */

export type Thermal = "GREEN" | "YELLOW" | "RED";

export interface Verdict {
  thermal: Thermal;
  /** PASS = permitted, MODIFY = flagged/scoped, BLOCK = stopped before execution */
  verdict: "PASS" | "MODIFY" | "BLOCK";
  /** The policy pack that evaluated the action. */
  pack: string;
  /** Semantic tags extracted from the action text. */
  tags: string[];
  /** Human-readable invariants (rules) that fired. */
  invariants: string[];
  /** One-line plain-English rationale shown to the visitor. */
  rationale: string;
  /** True when the action is blocked before any answer is generated. */
  blocked: boolean;
  /** Where the verdict came from: the browser demo or the live engine. */
  source: "demonstration" | "engine";
}

interface TagRule {
  tags: string[];
  patterns: RegExp[];
}

// Condensed from the production engine's TAG_RULES. Same intent, same
// categories — maps natural language to policy-pack tags.
const TAG_RULES: TagRule[] = [
  {
    tags: ["pii"],
    patterns: [
      /\b(SSNs?|social security|social\b|credit card|debit card|bank account|routing number|passport|driver'?s?\s*license|date of birth|DOB|phone number|email address|home address|maiden name|PII|personally identifiable)\b/gi,
      /\b\d{3}[-.\s]\d{2}[-.\s]\d{4}\b/g, // SSN format XXX-XX-XXXX
      /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, // credit card format
    ],
  },
  {
    tags: ["phi", "pii"],
    patterns: [
      /\b(patient|diagnosis|diagnosed|medical record|MRN|prescription|prescribed|medication|HIPAA|PHI|health record|treatment plan|lab results?|prognosis|symptom|chronic|disease)\b/gi,
      /\b(HIV|cancer|diabetes|hepatitis|depression|bipolar|schizophrenia|PTSD|Alzheimer|dementia|epilepsy|tumor|leukemia)\b/gi,
    ],
  },
  {
    tags: ["student"],
    patterns: [
      /\b(student|pupil|transcript|GPA|report card|IEP|504 plan|FERPA|academic record|class rank|student id)\b/gi,
    ],
  },
  {
    tags: ["exfil"],
    patterns: [
      /\b(send|share|export|upload|transfer|disclose|forward|transmit|email|post|publish|distribute|leak|extract)\s+(this|the|these|my|our|their|some|all|sensitive|confidential|private|personal)\b/gi,
      /\b(I have|here('s| is|'re| are)).{0,20}(SSNs?|social security|credit cards?|bank|medical|patient|student|records?|passport|license|PII)\b/gi,
      /\b(help me|can you).{0,20}(organize|sort|look up|find|verify|process|handle).{0,20}(SSNs?|social|credit|bank|medical|patient|records?|passport|PII)\b/gi,
      /\b(expose|reveal|show me|give me|get me|read out|tell me).{0,20}(the |a |their |his |her |this |customer'?s? |client'?s? )?(SSNs?|social security|credit card|bank account|passport|medical record)\b/gi,
    ],
  },
  {
    tags: ["pii", "exfil"],
    patterns: [
      /\b(api[_\-\s]?key|api[_\-\s]?secret|access[_\-\s]?token|secret[_\-\s]?key|private[_\-\s]?key|auth[_\-\s]?token|password|passwd|pwd)\b/gi,
      /\b(sk-[A-Za-z0-9]{10,}|ghp_[A-Za-z0-9_]{20,}|AKIA[A-Z0-9]{10,})\b/g,
    ],
  },
  {
    tags: ["destroy", "irreversible"],
    patterns: [
      /\b(destroy|wipe|purge|shred|permanently delete|drop table|truncate|nuke|rm -rf)\b/gi,
    ],
  },
  {
    tags: ["financial"],
    patterns: [
      /\b(payment|transaction|invoice|billing|revenue|salary|compensation|account balance|wire transfer|ACH|routing|bank statement|payroll)\b/gi,
    ],
  },
  {
    tags: ["financial", "large"],
    patterns: [
      /\$\s*(?:\d{1,3},)*\d{3,}(?:\.\d{2})?/g, // $1,000+
      /\b(large transfer|wire transfer|bulk payment|million|hundred thousand)\b/gi,
    ],
  },
  {
    tags: ["deploy", "production", "irreversible"],
    patterns: [
      /\b(force push|push to prod|production|drop database|go live|deploy)\b/gi,
    ],
  },
  {
    tags: ["privilege"],
    patterns: [
      /\b(admin|root|sudo|superuser|privilege|escalat|bypass|override|unauthorized|gain access|brute force)\b/gi,
    ],
  },
  {
    tags: ["audit", "disable"],
    patterns: [
      /\b(disable (audit|logging|tracking)|turn off (logs?|audit|monitoring)|stop (recording|logging|tracking))\b/gi,
    ],
  },
  {
    tags: ["bulk"],
    patterns: [
      /\b(bulk|batch|all records|every record|mass|entire database|full export|complete dump|select \*|list of (all|every))\b/gi,
    ],
  },
  {
    tags: ["exfil", "financial", "irreversible"],
    patterns: [
      /\b(fraud|embezzle|launder|forge|counterfeit|steal|skim|phish|identity theft)\b/gi,
    ],
  },
];

export function extractTags(text: string): string[] {
  const tagSet = new Set<string>();
  for (const rule of TAG_RULES) {
    for (const pattern of rule.patterns) {
      pattern.lastIndex = 0;
      if (pattern.test(text)) {
        rule.tags.forEach((t) => tagSet.add(t));
        break;
      }
    }
  }
  return [...tagSet];
}

const PACK_BY_TAG: Record<string, string> = {
  phi: "HIPAA / PHI",
  student: "FERPA / Student Records",
  financial: "Financial Controls",
  pii: "PII Protection",
};

function choosePack(tags: string[]): string {
  for (const t of ["phi", "student", "financial", "pii"]) {
    if (tags.includes(t)) return PACK_BY_TAG[t];
  }
  return "Baseline Conduct";
}

/**
 * The local demonstration evaluator. Maps extracted tags to a verdict using
 * the same logic shape as the engine's policy packs:
 *   RED    — exfiltration / destruction / fraud / privilege escalation /
 *            disabling the audit trail. Blocked before any answer runs.
 *   YELLOW — sensitive data present, or bulk / large-value operations.
 *            Permitted but scoped, masked, and flagged.
 *   GREEN  — routine, no sensitive data. Permitted, sealed, logged.
 */
function evaluate(text: string, tags: string[]): Verdict {
  const has = (t: string) => tags.includes(t);
  const invariants: string[] = [];

  // RED — hard stops, blocked before execution.
  const exfilPii = has("exfil") && (has("pii") || has("phi"));
  if (
    exfilPii ||
    has("destroy") ||
    has("disable") ||
    (has("privilege") && has("exfil")) ||
    (has("irreversible") && has("financial"))
  ) {
    if (exfilPii) invariants.push("INV-PII-EXFIL: sensitive identifiers may not leave the boundary");
    if (has("phi")) invariants.push("INV-HIPAA-DISCLOSE: PHI disclosure requires authorization");
    if (has("destroy")) invariants.push("INV-NO-DESTROY: irreversible destruction is denied");
    if (has("disable")) invariants.push("INV-AUDIT-IMMUTABLE: the audit trail cannot be disabled");
    if (has("privilege")) invariants.push("INV-PRIV-ESCALATE: privilege escalation is denied");
    return {
      thermal: "RED",
      verdict: "BLOCK",
      pack: choosePack(tags),
      tags,
      invariants,
      rationale:
        "Blocked before any answer was generated. The action would move or expose protected data, or take an irreversible step the policy forbids.",
      blocked: true,
      source: "demonstration",
    };
  }

  // YELLOW — permitted but scoped / masked / flagged.
  if (has("bulk") || has("large") || has("export") || has("pii") || has("phi") || has("financial") || has("production")) {
    if (has("bulk") || has("large")) invariants.push("INV-SCOPE: bulk or high-value requests must be scoped before they run");
    if (has("pii") || has("phi")) invariants.push("INV-MASK: sensitive identifiers are masked and excluded from the record");
    if (has("production")) invariants.push("INV-CHANGE-CONTROL: production changes require explicit confirmation");
    return {
      thermal: "YELLOW",
      verdict: "MODIFY",
      pack: choosePack(tags),
      tags,
      invariants,
      rationale:
        "Permitted with conditions. Sensitive fields are masked and the scope is narrowed before the action passes.",
      blocked: false,
      source: "demonstration",
    };
  }

  // GREEN — routine.
  invariants.push("INV-BASELINE: routine action, no sensitive data, permitted");
  return {
    thermal: "GREEN",
    verdict: "PASS",
    pack: choosePack(tags),
    tags,
    invariants,
    rationale: "Permitted. No sensitive data and no protected action. Sealed and logged.",
    blocked: false,
    source: "demonstration",
  };
}

/**
 * SEAM 1. The single function that swaps to make this production-real.
 *
 * Default (public build): classify in the browser and return the
 * demonstration verdict above — instant, offline, honest.
 *
 * Production: set GATEKEEPER_API_URL and this will POST the text to the live
 * engine via /api/classify and return the real verdict, pack, and invariants.
 * Nothing else in the app needs to change.
 */
export async function classifyInput(text: string): Promise<Verdict> {
  // Try the live-engine seam first; fall back to the local demonstration.
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = (await res.json()) as Partial<Verdict> & { engine?: boolean };
        // The API returns engine:false when no live engine is configured,
        // signalling us to use the local demonstration verdict instead.
        if (data.engine) {
          return { ...evaluate(text, extractTags(text)), ...data, source: "engine" } as Verdict;
        }
      }
    } catch {
      // Network/seam unavailable — fall through to local demonstration.
    }
  }
  return evaluate(text, extractTags(text));
}

// Exposed for the server route and tests.
export const __evaluate = evaluate;
