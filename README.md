# OASSE-Website

The Oak & Sparrow Systems Enterprises `.com` — a full Next.js build that
**explains Gatekeeper, runs onboarding on-site, and hosts the governed
assistant**, deployed on Vercel.

Built to the canonical [`docs/master-build-spec.md`](docs/master-build-spec.md).

---

## What it does (in the spec's priority order)

1. **Explains the product** — what Gatekeeper does and why it matters, in under
   thirty seconds: govern the decision not the string, the GREEN/YELLOW/RED
   verdict model, hash chaining (never blockchain), and the three outcomes.
2. **Onboards on-site** — a five-step flow (Qualify → See the fit → The
   engagement → Your details → Book the call) with **save-and-resume**, so a
   qualified prospect can start without a sales call.
3. **Hosts the governed assistant** — a live chatbot that answers questions
   *and* demonstrates the product by governing its own responses in front of
   the visitor, sealing each decision into a **real SHA-256 hash chain** you can
   verify in the browser.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — brand: light-blue scheme (cream paper, ink serif, slate-blue accent), architectural
- No database required; the public build runs with **zero configuration**

## Project layout

```
app/
  layout.tsx, page.tsx, globals.css   # shell + page order (spec §6)
  api/classify/route.ts               # Seam 1 (live Gatekeeper engine)
  api/chat/route.ts                   # Seam 2 (grounded answer model)
  api/onboarding/route.ts             # lead capture / webhook
components/                           # one component per site section
lib/
  classifier.ts                       # browser governance demo + Seam 1
  hashchain.ts                        # real SHA-256 hash chaining
content/
  site.ts                             # all canonical copy (single source)
  oasse_chatbot_knowledge_base.json   # the assistant's approved answer base (22 entries)
docs/
  master-build-spec.md                # the spec this build implements
  chatbot-install.md                  # Seam 2 answer engine: install + design notes
```

## The two swap-in seams (for the CTO)

The public build is honest by design: **answers are live, governance is a
demonstration.** Two functions are the only things that change to make it
production-real — nothing else (hash chain, panel, chat flow) moves:

- **Seam 1 — `classifyInput()`** (`lib/classifier.ts` + `app/api/classify`).
  Set `GATEKEEPER_API_URL` and the verdict comes from the live engine's
  `/evaluate` instead of the in-browser classifier.
- **Seam 2 — the answer engine** (`app/api/chat/route.ts` +
  `content/oasse_chatbot_knowledge_base.json`). Hardened for public traffic
  (rate limiting, input caps, history validation, injection guard, timeout).
  Set `ANTHROPIC_API_KEY` (and `CHAT_MODEL`, default `claude-sonnet-4-6`) and
  it grounds the model on the approved KB, answering only from it. With no key
  every reply is the contact handoff. See `docs/chatbot-install.md`.

## Local development

```bash
npm install
cp .env.example .env.local   # optional — all keys are optional
npm run dev                  # http://localhost:3000
```

## Deploy on Vercel

Next.js is Vercel-native, so this is zero-config — no `vercel.json` needed.

1. In Vercel: **Add New → Project → Import** this GitHub repo, and pick the
   deploy branch.
2. Vercel auto-detects Next.js: build `next build`, output handled
   automatically (the App Router API routes run as serverless functions). No
   build settings to change.
3. (Optional) Add Environment Variables from [`.env.example`](.env.example):
   - `NEXT_PUBLIC_SCHEDULING_URL` — your onboarding booking link
   - `GATEKEEPER_API_URL` — wire Seam 1 to the live engine
   - `ANTHROPIC_API_KEY` / `CHAT_MODEL` — wire Seam 2 to a live model
   - `ONBOARDING_WEBHOOK_URL` — forward captured leads to a CRM/Slack
4. Deploy, then add the custom domain in **Vercel → Settings → Domains**:
   `oakandsparrowsystemsenterprise.com`.

> The product's real Gatekeeper engine runs on client networks, not in this
> deployment — so the Vercel host stays light: it serves the marketing site,
> the knowledge-base assistant, and the seam stubs.

## Open items carried from the spec (`VERIFY`)

- **Lead language** — "manager in the room" vs the harder compliance line
  ("your employees use AI, we make sure it's legal") still being reconciled
  with Nick and Scott. The build currently runs the manager-in-the-room line;
  the hero is the surface that changes once this is decided.
  (`content/site.ts → positioning`.)
- **Pricing** — onboarding fee / monthly floor are gated behind the call until
  the usage analysis lands. (`content/site.ts → engagement.pricingNote`.)
- **Engine internals** — keep model names, versions, and rule counts out of
  public copy; verify any specific figure with the CTO.

## Brand

Light-blue scheme, matched to the Gatekeeper page: cream paper `#F4F1EA`,
near-black ink `#1A1A1A` serif headlines, a single muted slate-blue accent
`#6F90A8` (`deep #557791`, `on-navy #9FBDD2`), gray body `#56606A`, navy
`#243240` as the dark anchor for the assistant panel and footer. Verdict
signal kept distinct: GREEN `#2D6A4F`, YELLOW `#B07D1E`, RED `#B0301F` on
light; brighter tints (`#7FD3AA`, `#E6CD7E`, `#FF9B8C`) on navy. Defined once
in [`tailwind.config.ts`](tailwind.config.ts).

> The accent `#6F90A8` is sampled by eye from the Gatekeeper hero. For a
> pixel-exact match, sample the computed color of the "legal." span / primary
> button on the live `.com` and drop it into `blue.DEFAULT`.

> Note: the rest of the brand collateral (docs, logs, sponsorship sheets)
> remains green-and-gold; the site and collateral diverge until the team
> decides whether the brand follows the site to blue.

## License

[Apache License 2.0](LICENSE). © 2026 Oak and Sparrow Systems Enterprises.
