// Oak & Sparrow .com  -  minimal static server for Railway
// Serves public/index.html. Health check at /healthz.
//
// SWAP-IN SEAMS (when ready to go backend, see README):
//   POST /api/govern   -> wire to the live Gatekeeper engine (chatbot seam 1)
//   POST /api/onboard  -> capture onboarding submissions (currently client-side only)
// Both are stubbed below, commented, and safe to ignore for a static deploy.

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// health check for Railway
app.get("/healthz", (_req, res) => res.status(200).json({ status: "ok" }));

// ---- SEAM 1: live governance (stub) ----
// Replace the body to call the on-prem Gatekeeper engine. Until then the
// site uses the in-browser simulated classifier and never calls this.
// app.post("/api/govern", async (req, res) => {
//   const { text } = req.body;
//   // const verdict = await gatekeeper.classify(text);  // <- real engine
//   res.json({ verdict: "GREEN", pack: "general", reason: "stub" });
// });

// ---- SEAM 2: onboarding capture (stub) ----
// Replace to persist onboarding submissions (DB, CRM, email).
// app.post("/api/onboard", async (req, res) => {
//   // await store(req.body);
//   res.json({ ok: true });
// });

// SPA-style fallback so any path serves the single page
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, () => console.log(`Oak & Sparrow site live on :${PORT}`));
