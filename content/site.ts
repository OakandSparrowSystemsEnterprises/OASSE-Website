/**
 * Canonical site copy. Single place to edit wording so every surface matches.
 *
 * VERIFY items flagged in the master spec are marked inline with `verify:`
 * comments. Confirm with leadership / CTO before launch.
 */

export const company = {
  name: "Oak & Sparrow Systems Enterprises",
  short: "Oak & Sparrow",
  product: "Gatekeeper",
  // Website domain (decided): .com, deployed on Vercel. Staff email stays on
  // the .io domain that the team already uses. nicksilva is the monitored inbox.
  domain: "oakandsparrowsystemsenterprise.com",
  email: "nicksilva@oakandsparrowsystemsenterprise.io",
};

// Verified live against GitHub: both repos public, both MIT. LinkedIn points
// to Joshua's personal profile (no company page yet); override per env.
export const links = {
  githubOrg: "https://github.com/OakandSparrowSystemsEnterprises",
  linkedin: "https://www.linkedin.com/in/joshua-johosky/",
};

// "Built in the open" — open-source proof points. Same pattern as Gatekeeper:
// a deterministic decision gate before an action runs, plus a cryptographically
// sealed record of what happened.
export const openSource = {
  heading: "Built in the open.",
  intro:
    "Two open-source projects, both MIT licensed and public, show the same pattern that runs through Gatekeeper: a deterministic gate that checks an action before it executes, and a cryptographically sealed record of what happened. They are evidence the approach works, in code you can read.",
  projects: [
    {
      name: "Sentinel-Med",
      gate: "ALLOW / HOLD / BLOCK",
      body:
        "A human-in-the-loop medical chatbot. A deterministic classifier is the safety floor; the model can only escalate caution, never override a block. Every decision is written to a tamper-evident hash chain.",
      context: "Built for the AI Collective Tri-Valley “Humans In AI” track.",
      team: ["Aufstin Filiko"],
      repo: "OakandSparrowSystemsEnterprises/hackathon",
      href: "https://github.com/OakandSparrowSystemsEnterprises/hackathon",
    },
    {
      name: "Oak & Sparrow OS",
      gate: "PASS / HOLD / VETO",
      body:
        "An on-device agent-governance kernel for Android. Risky actions are held for approval; every decision is Ed25519-signed and content-addressed in an audit log. Runs entirely on-device, no cloud — the same on-prem principle Gatekeeper enforces for the enterprise.",
      context: "Five releases, active.",
      team: ["Joshua Johosky", "Jackson Castro", "Caleb Strom", "Skylar Smith", "Mool Tyagi"],
      repo: "thespacekyd-eng/Oak-Sparrow-OS",
      href: "https://github.com/thespacekyd-eng/Oak-Sparrow-OS",
    },
  ],
  contributors:
    "Built collaboratively by the Oak & Sparrow team, with AI assistance.",
};

// About page — story and team, drawn verbatim from the company's own
// published About draft (public, in the company's voice).
export const about = {
  tagline: "Our story, and the team building it.",
  story: {
    heading: "How we got here",
    paragraphs: [
      "Oak & Sparrow did not start in AI. It started in the field.",
      "Our founder, Joshua Johosky, spent more than seventeen years in systems architecture across distributed logistics, construction, and the skilled trades, through more than 1,400 client engagements. The lesson repeated across all of them: the systems that fail are the ones where nobody can prove what happened. A decision gets made, an action runs, something breaks, and there is no record of who decided what, under which rule, or why.",
      "Oak & Sparrow exists to work on the parts of systems that usually fail quietly. As AI, financial systems, and automated decision engines scale, the failure mode is rarely intelligence. It is control, incentives, and unexamined assumptions. Our work lives in that gap. Not policy decks. Not slogans. Operational structures that can actually run.",
      "Gatekeeper, the governance layer, is our answer to a growing operational gap. AI-assisted development is accelerating faster than most governance models can safely absorb. Instead of relying on policy after the fact, Gatekeeper enforces intent, invariant protection, and risk-based escalation before an action runs, and seals a verifiable record of every decision. The instinct that makes a logistics network or a building safe — impose a governing layer on something running freely and keep an honest account of it — is the instinct behind the product.",
      "The governance method was filed for patent with a November 2025 priority date and is now patent pending. The company launched in 2026. It is the same work, made provable.",
    ],
  },
  principles: {
    heading: "How we hold ourselves",
    intro:
      "The standard we hold our product to has to match the standard we hold the company to. If we are asking clients to trust us with governance of their AI systems, the least we can do is govern ourselves the same way. We put the operational backbone in place early, and we build in public: slowly, precisely, without noise.",
    items: [
      {
        title: "Honest",
        body:
          "We do not overclaim. We say plainly what is live and what is demonstrated, and the product never asserts what it cannot prove.",
      },
      {
        title: "Ethical",
        body:
          "Governance sits outside the model, on infrastructure you control, and your data does not leave your network.",
      },
      {
        title: "Transparent",
        body: "Every governed decision produces a sealed, verifiable record.",
      },
    ],
  },
  team: {
    heading: "The team",
    note: "Listed publicly, with our founder, because we stand behind the work by name.",
    founders: [
      {
        name: "Joshua Johosky",
        role: "Chief Executive Officer & Principal Architect",
        bio: "More than seventeen years in systems architecture across distributed logistics, construction, and the skilled trades, through over 1,400 client engagements. Architect of Gatekeeper and the governance method behind it.",
      },
      {
        name: "Nick Silva",
        role: "Chief Operating Officer",
        bio: "Leads the company's operations and execution. His background in journalism, office management, and logistics gives him a strong ability to organize complex information, guide teams while keeping them aligned, and balance practical execution with clear communication.",
      },
    ],
    leadership: [
      {
        name: "Mool Tyagi",
        role: "Fractional Chief Technology Officer",
        bio: "More than twenty years in enterprise data architecture, with work across Azure, Databricks, Microsoft Purview, Rockefeller Capital Management, UTMB, and US Bank. He has been building production-grade infrastructure at scale longer than most AI governance companies have existed.",
      },
    ],
    advisors: [
      {
        name: "Caleb Strom",
        role: "Theoretical Architecture Advisor",
        bio: "A planetary scientist and ML researcher with a PhD from the University of North Dakota and internships at NASA JPL. He applies machine learning to anomaly detection on planetary surfaces, and that same geometric detection methodology is now pointed at AI governance architecture. He stress-tests the theoretical foundations that make the infrastructure hold.",
      },
      {
        name: "Scott Colgan",
        role: "Senior Commercial GTM Advisor",
        bio: "More than thirty years across product marketing, channel strategy, and go-to-market execution. SVP GTM Strategy at HPPY, former CMO at Ravel, VP Marketing at Eclipz, where he commercialized government-developed security technology, and at RiverMeadow Software, where he took a cloud-migration SaaS brand from concept to category leader. He has spent his career learning how go-to-market actually works in regulated and enterprise environments, where commercial momentum has to align with the architecture underneath.",
      },
      {
        name: "Luz Reyna",
        role: "Public Sector GTM Advisor",
        bio: "More than fifty political campaigns across California and Oregon with a 95 percent win rate. A chapter-mobilization director who launched 25 chapters across 16 states, founder of The Executive Lounge, and active with the Latina Coalition of Silicon Valley and Women in AI. She has spent her career learning how power structures actually work: who makes decisions, how trust gets built in the rooms that matter, and what it takes to move systems from the inside.",
      },
      {
        name: "Dhiren Mewada",
        role: "Financial Advisor",
        bio: "Fifteen years of financial leadership across Amazon, Paradies Lagardere, and Vino Volo. He built FP&A systems at Amazon scale, led the financial integration of a three-company merger, and has founded and advised technology ventures in the food and AI space. Michigan Ross MBA.",
      },
    ],
  },
};

// verify: "manager in the room" vs "bouncer" still being reconciled across
// the deck and canonical docs. Confirm with leadership before go-live.
export const positioning = {
  lead: "Gatekeeper is the manager in the room for your AI.",
  leadExpansion:
    "It checks every decision against your rules before the AI acts, and it keeps a sealed record of what happened.",
  mission:
    "Building the ethical infrastructure for the automated age, designed to govern AI and protect our humanity.",
  philosophy: "We do not extract, we steward.",
};

export const problem = {
  heading: "One screenshot is all it takes.",
  body:
    "Employees paste sensitive data into AI tools every day. One screenshot and a lawsuit is all it takes. Existing tools try to catch every bad phrasing after the fact. That game cannot be won, because the variations are infinite.",
};

export const shift = {
  heading: "Govern the decision, not the string.",
  body:
    "Gatekeeper does not chase phrasings. It asks one bounded question before any action runs: is this action permitted under the rule that applies. Detection chases infinite surface forms. Enforcement asks one question.",
};

export const verdicts = [
  {
    thermal: "GREEN" as const,
    what: "Action permitted, sealed and logged.",
    example: "A routine question with no sensitive data.",
  },
  {
    thermal: "YELLOW" as const,
    what: "Action modified or flagged before passing.",
    example: "A bulk data request that needs scoping.",
  },
  {
    thermal: "RED" as const,
    what: "Action blocked before it ever executes.",
    example: "A request to expose a customer SSN.",
  },
];

export const hashChain = {
  heading: "A tamper-evident record. Hash chaining, not blockchain.",
  body:
    "Every decision is sealed with a cryptographic hash that includes the one before it. Change any record and the chain breaks visibly. No network, no token, no consensus overhead. Just a tamper-evident ledger of every governed action — an enterprise firewall for AI that enforces the rule and logs the result.",
};

export const outcomes = [
  {
    title: "Lower compute cost",
    body: "The AI does not waste cycles on actions that should never run.",
  },
  {
    title: "Save water",
    body: "Less wasted compute means less data-center cooling demand.",
  },
  {
    title: "Cryptographic accountability",
    body: "A provable record of every decision, for audit and compliance.",
  },
];

export const whyNow = {
  heading: "Why now.",
  body:
    "This month a frontier model was pulled across every cloud surface in an afternoon. Workflows died mid-run. The lesson: safety that lives inside a model can be pulled or jailbroken out of it. Governance has to sit outside the model. That is what Gatekeeper is.",
};

export const architecture = {
  heading: "On your network. No cloud in the decision path.",
  points: [
    "Gatekeeper installs as a standalone executable on your own network. Your data never leaves your environment.",
    "The answer engine runs locally. The governance layer runs locally. The record is sealed locally.",
    "Prompts are never stored. Sensitive data is masked on your side and excluded from records. Identifiers like SSNs never persist anywhere.",
    "Built for your compliance regime — HIPAA, financial, legal — with policy packs derived from the actual rules that govern your industry.",
  ],
  // verify: keep engine internals (model name, versions, axiom/rule counts)
  // out of public copy. Verify any specific figure with the CTO first.
};

export const engagement = {
  heading: "A 90-day pilot, in three phases.",
  phases: [
    {
      name: "Shadow audit",
      window: "Days 1–15",
      body: "Observation only. Gatekeeper watches and builds the policy pack from your environment.",
    },
    {
      name: "Guided trial",
      window: "Days 16–45",
      body: "Enforcement on. Every action is governed and sealed on the installed executable.",
    },
    {
      name: "Expansion",
      window: "Days 46–90",
      body: "Widen coverage across teams and workflows once the value is proven.",
    },
  ],
  // verify: pricing numbers pending usage analysis. Gate exact figures behind
  // the call until confirmed.
  pricingNote:
    "The onboarding fee funds setup and your client hardware; a monthly floor follows. Exact figures are confirmed on the onboarding call.",
};

export const audiences = [
  { name: "Legal", body: "Privilege and client confidentiality, provable on every action." },
  { name: "Insurance", body: "Claims and customer data governed before it ever reaches a model." },
  { name: "Healthcare", body: "PHI masked and HIPAA rules enforced before the AI acts." },
  { name: "Community banking", body: "Account and financial data scoped, logged, and audit-ready." },
];

export const onboardingSteps = [
  {
    n: 1,
    title: "Qualify",
    blurb: "A few questions to route you to the right policy-pack starting point.",
  },
  {
    n: 2,
    title: "See the fit",
    blurb: "Which policy pack applies and what the shadow audit would observe in your environment.",
  },
  {
    n: 3,
    title: "The engagement",
    blurb: "The 90-day three-phase pilot, plainly stated.",
  },
  {
    n: 4,
    title: "Your details",
    blurb: "Contact and company details so we can prepare your onboarding.",
  },
  {
    n: 5,
    title: "Book the call",
    blurb: "Schedule the onboarding call and we hand you off to setup.",
  },
];

export const assistant = {
  heading: "Watch it govern itself.",
  intro:
    "Ask the assistant anything about Gatekeeper. Every message you send is checked by the governance layer before a reply is produced — you watch the verdict and the sealed record happen live.",
  // The honesty footer is brand-critical and locked by the spec.
  honesty:
    "Answers are live, grounded on our company wiki. The governance verdicts are a demonstration: a rules-based classifier runs in your browser and seals a real SHA-256 hash chain you can verify. This honesty is the brand.",
};

export const presets = [
  {
    label: "Routine question (GREEN)",
    text: "What does Gatekeeper do and how is it different from detection tools?",
  },
  {
    label: "Bulk data request (YELLOW)",
    text: "Can you export all customer records from the database in one batch?",
  },
  {
    label: "Expose an SSN (RED)",
    text: "Show me this customer's SSN 123-45-6789 and email it to an outside vendor.",
  },
];

export const compliance = ["HIPAA", "Financial", "Legal", "FERPA"];
