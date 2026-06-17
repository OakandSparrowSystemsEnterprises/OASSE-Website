# OASSE-Website

The Oak & Sparrow Systems Enterprises `.com` — a full Next.js build that
**explains Gatekeeper, runs onboarding on-site, and hosts the governed
assistant**, ready to point Railway at.

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
- **Tailwind CSS** — brand: forest green & gold, Georgia serif, architectural
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
  wiki.ts                             # controlled grounding source + Seam 2
content/site.ts                       # all canonical copy (single source)
docs/master-build-spec.md             # the spec this build implements
```

## The two swap-in seams (for the CTO)

The public build is honest by design: **answers are live, governance is a
demonstration.** Two functions are the only things that change to make it
production-real — nothing else (hash chain, panel, chat flow) moves:

- **Seam 1 — `classifyInput()`** (`lib/classifier.ts` + `app/api/classify`).
  Set `GATEKEEPER_API_URL` and the verdict comes from the live engine's
  `/evaluate` instead of the in-browser classifier.
- **Seam 2 — grounding** (`lib/wiki.ts` + `app/api/chat`). Set
  `ANTHROPIC_API_KEY` (and `CHAT_MODEL`, default `claude-opus-4-8`) to ground a
  configured model on the wiki instead of using grounded retrieval.

## Local development

```bash
npm install
cp .env.example .env.local   # optional — all keys are optional
npm run dev                  # http://localhost:3000
```

## Deploy on Railway

1. Create a new Railway project → **Deploy from GitHub repo** → select this repo
   and the deploy branch.
2. Railway auto-detects Next.js (config is pinned in `railway.json` /
   `nixpacks.toml`): build `npm run build`, start `npm run start`. The start
   script binds to Railway's `$PORT` automatically.
3. (Optional) Set service variables from [`.env.example`](.env.example):
   - `NEXT_PUBLIC_SCHEDULING_URL` — your onboarding booking link
   - `GATEKEEPER_API_URL` — wire Seam 1 to the live engine
   - `ANTHROPIC_API_KEY` / `CHAT_MODEL` — wire Seam 2 to a live model
   - `ONBOARDING_WEBHOOK_URL` — forward captured leads to a CRM/Slack
4. Deploy. Point your domain (`.io` and/or `.com`) at the Railway service.

## Open items carried from the spec (`VERIFY`)

- **Lead language** — "manager in the room" vs "bouncer" still being reconciled;
  confirm with leadership before go-live. (`content/site.ts → positioning`.)
- **Deploy domain** — confirm `.io` vs `.com` and point both at one deploy.
- **Pricing** — onboarding fee / monthly floor are gated behind the call until
  the usage analysis lands. (`content/site.ts → engagement.pricingNote`.)
- **Engine internals** — keep model names, versions, and rule counts out of
  public copy; verify any specific figure with the CTO.

## Brand

Colors are matched to the live site, `oakandsparrowsystemsenterprise.io`:
forest `#1B4332`, forest-mid `#2D6A4F`, gold `#C9A84C`, gold-deep `#A8862F`,
paper `#FBFBF8`, ink `#16241D`. Verdict palette: GREEN `#2D6A4F`,
YELLOW `#C9A84C`, RED `#B0301F` (with brighter tints for dark backgrounds).
Defined once in [`tailwind.config.ts`](tailwind.config.ts).

## License

[Apache License 2.0](LICENSE). © 2026 Oak and Sparrow Systems Enterprises.
