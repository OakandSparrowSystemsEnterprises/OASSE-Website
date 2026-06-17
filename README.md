# Oak & Sparrow Systems Enterprises — Website

Marketing site and live governed-assistant demo for Gatekeeper, the pre-execution AI governance engine.

The site is a single self-contained page (`public/index.html`): hero, the problem, govern-the-decision, the verdict model, the live governed assistant, architecture and trust, who it is for, the 90-day pilot, on-site onboarding, mission, and footer.

## Deploy on Railway

This repo runs as a tiny Node/Express static server so Railway can deploy it directly.

1. Push this repo to GitHub.
2. In Railway: New Project → Deploy from GitHub repo → pick this repo.
3. Railway auto-detects Node, runs `npm install`, then `npm start`.
4. The site serves on Railway's assigned URL. Health check is at `/healthz`.
5. Add your custom domain in Railway → Settings → Networking.

No environment variables are required for the static site.

## What is real vs simulated

The governed assistant on the site answers and renders **real SHA-256 hash-chained records in the browser**, but the governance **verdicts are simulated** by a rules-based classifier (`classifyInput()` inside `public/index.html`). This is intentional and disclosed on the page. Production connects the same flow to the live Gatekeeper engine inside the client environment.

## Swap-in seams (when going backend)

Two stubs are in `server.js`, commented out and safe to ignore for the static deploy:

- **Seam 1 — `POST /api/govern`**: replace the stub body to call the live Gatekeeper engine, then point `classifyInput()` in `index.html` at it instead of the in-browser rules. This makes the demo's verdicts real.
- **Seam 2 — `POST /api/onboard`**: replace to persist onboarding submissions (database, CRM, or email). Onboarding is currently client-side only.

## Local run

```
npm install
npm start
# open http://localhost:3000
```

## Static-only alternative

If you do not need a backend, this site can also deploy as pure static hosting (e.g. Vercel) by serving `public/index.html` directly. Railway is the right target only when you plan to wire the seams above.

## Open decisions (flagged, not yet locked)

- **Domain**: `.io` (currently live on Vercel) vs `.com`. Point DNS and repo at one.
- **Lead language**: "manager in the room" vs "bouncer" — pending reconciliation across deck and canonical docs.
- **Pricing numbers**: onboarding fee, monthly floor, per-band artifact prices — pending the usage analysis. The site references the structure, not figures.

## Structure

```
.
├── public/
│   └── index.html      # the entire site, self-contained
├── server.js           # minimal Express static server + seam stubs
├── package.json
├── railway.json        # Railway build/deploy config + health check
├── Procfile
├── .gitignore
└── README.md
```
