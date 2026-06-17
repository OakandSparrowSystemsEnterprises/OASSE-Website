# Oak and Sparrow .com Master Build Spec

> Everything the website must do: explain the product, run onboarding on-site,
> and host the governed assistant.
>
> _June 17, 2026. Single source of truth for the .com. Reflects the current
> on-premises architecture and the locked decisions of this week. Supersedes the
> earlier website content spec and master build paper, which were written on the
> prior cloud-plus-extension model._
>
> Source: Google Drive `oasse_dotcom_master_spec`. This is a verbatim transcript
> kept in-repo so the build and the spec travel together.

## 0. What the site is for

The .com does three jobs, in priority order. First, it tells a qualified visitor
what Gatekeeper does and why it matters, in under thirty seconds of reading.
Second, it runs onboarding on-site, so an interested prospect can start the
engagement without a sales call. Third, it hosts the governed assistant, a live
chatbot that both answers questions and demonstrates the product by governing
itself in front of the visitor.

The visitor is a decision-maker at a regulated firm: legal, insurance,
healthcare, community banking. They have heard that employees pasting sensitive
data into AI is a liability, and they need governance they can prove. The site
speaks to that person, not to a general audience.

## 1. Positioning and voice

**Lead line, the manager in the room.** Gatekeeper is the manager in the room
for your AI: it checks every decision against your rules before the AI acts, and
it keeps a sealed record of what happened. This is the current positioning,
replacing the earlier bouncer framing.

**VERIFY:** Manager-in-the-room versus bouncer is still being reconciled across
the deck and canonical docs. Confirm the lead language with leadership before the
site goes live so all surfaces match.

Voice: plain, precise, confident. No jargon theater. Forest green and gold,
Georgia serif, generous white space, architectural not illustrative. The site
should feel like infrastructure, not a pitch.

**Mission line, canonical.** Building the ethical infrastructure for the
automated age, designed to govern AI and protect our humanity. Philosophy: we do
not extract, we steward.

## 2. What we do, the explainer section

**The problem.** Employees paste sensitive data into AI tools every day. One
screenshot and a lawsuit is all it takes. Existing tools try to catch every bad
phrasing after the fact. That game cannot be won, because the variations are
infinite.

**The shift: govern the decision, not the string.** Gatekeeper does not chase
phrasings. It asks one bounded question before any action runs: is this action
permitted under the rule that applies. Detection chases infinite surface forms.
Enforcement asks one question.

**The verdict model.** Every action gets a verdict before it executes, and a
sealed record after.

| Verdict | What happens | Example |
| :-- | :-- | :-- |
| GREEN | Action permitted, sealed and logged. | A routine question with no sensitive data. |
| YELLOW | Action modified or flagged before passing. | A bulk data request that needs scoping. |
| RED | Action blocked before it ever executes. | A request to expose a customer SSN. |

**How the record works: hash chaining, not blockchain.** Every decision is
sealed with a cryptographic hash that includes the one before it. Change any
record and the chain breaks visibly. No network, no token, no consensus
overhead. Just a tamper-evident ledger of every governed action. Think of it as
an enterprise firewall for AI: it enforces the rule and logs the result. Hash
chaining, never blockchain, is locked across all copy.

**The three outcomes.**

- Lower compute cost: the AI does not waste cycles on actions that should never run.
- Save water: less wasted compute means less data-center cooling demand.
- Cryptographic accountability: a provable record of every decision, for audit and compliance.

**Why now.** This month a frontier model was pulled across every cloud surface in
an afternoon. Workflows died mid-run. The lesson: safety that lives inside a
model can be pulled or jailbroken out of it. Governance has to sit outside the
model. That is what Gatekeeper is.

## 3. The architecture, stated for trust

Public copy stays general so the site does not break when internals change, but
the trust-critical facts are stated plainly.

- Gatekeeper installs as a standalone executable on the client's own network. Your data never leaves your environment. There is no cloud in the decision path.
- The answer engine runs locally. The governance layer runs locally. The record is sealed locally.
- Prompts are never stored. Sensitive data is masked on your side and excluded from records. Identifiers like SSNs never persist anywhere.
- Built for your compliance regime: HIPAA, financial, legal, with policy packs derived from the actual rules that govern your industry.

**VERIFY:** Keep engine internals (model name, version numbers, axiom and rule
counts) out of public copy. State capabilities generally. Verify any specific
figure with the CTO before it appears anywhere on the site.

## 4. Onboarding on-site, the core new requirement

The site must let a qualified prospect begin onboarding without a sales call. The
flow runs in five steps, each a section or screen, with a save-and-resume so a
serious prospect can complete it in one sitting or come back.

1. **Qualify.** A short set of questions: industry, compliance regime, rough volume, current AI tools in use. This routes them to the right policy-pack starting point and filters tire-kickers from real prospects.
2. **Show the fit.** Based on the answers, the site states which policy pack applies (HIPAA, financial, legal, telecom) and what the shadow-audit phase would observe in their environment. This is the moment the visitor sees the product is built for them specifically.
3. **Explain the engagement.** The 90-day three-phase pilot, plainly: shadow audit days 1 to 15, observation only; guided trial days 16 to 45, enforcement on; expansion days 46 to 90. State that the onboarding fee funds setup and the client hardware, and that the monthly floor follows.
4. **Capture and schedule.** Collect contact and company details, then book the onboarding call directly on-site via the scheduling link. This is the conversion action. Everything before it is to earn this click.
5. **Confirm and hand off.** A confirmation screen and email, plus what happens next: NDA, hardware provisioning funded by onboarding, policy-pack build during the shadow window. Set the expectation that enforcement begins at day 16 on the installed executable.

Onboarding is the priority new capability. The old site was a positioning page
with a Calendly link. This site qualifies, educates, and converts on its own,
then routes a warm, informed prospect into the call.

**VERIFY:** Pricing numbers (onboarding fee, monthly floor, per-band artifact
prices) are pending the usage analysis. Onboarding flow should reference the
structure and gate exact figures behind the call until confirmed.

## 5. The governed assistant (chatbot)

The site hosts a live chatbot that does double duty: it answers visitor questions
about Gatekeeper, and it demonstrates the product by governing its own responses
in front of the visitor. The reference build exists
(`gatekeeper_governed_chatbot.jsx`) and is the starting point.

**How it works, three layers.**

- Answer engine. Generates the reply. Model-agnostic by design; runs on the local engine in the product, and on a configured model for the public site build.
- Governance layer. Every input passes through Gatekeeper before a reply is produced. It renders a GREEN, YELLOW, or RED verdict and seals a hash-chained record, shown live in a side panel so the visitor watches governance happen.
- Wiki grounding. The assistant answers from the external company wiki, a controlled source, so it speaks accurately about Gatekeeper and does not hallucinate product claims.

**What is real and what is simulated, state it honestly on the public build.** On
the public site, the answers are real but the governance verdicts are a
demonstration: a rules-based classifier runs in the browser and renders the
verdict and a real SHA-256 hash chain the visitor can verify. The footer must say
so plainly: answers are live, governance is a demonstration of how the engine
behaves. This honesty is the brand.

**The two swap-in seams for the CTO.**

- **Seam 1.** `classifyInput()`: replace the simulated browser classifier with a call to the live Gatekeeper engine. Send the text, receive verdict, pack, invariants. Everything else, the hash chain, the panel, the chat flow, stays exactly as built.
- **Seam 2.** Grounding: chunk the external wiki and ground the assistant's answers on it, vector index or direct context injection, the CTO's call given it is one controlled source.

**Demonstration presets.** Include preset example chips so a visitor can see the
verdicts without typing: a GREEN routine question, a YELLOW bulk-data request, and
a RED that tries to expose an SSN and is blocked before any answer is generated.
The RED block, shown live, is the single most persuasive thing on the site.

Branding on the chatbot is inline: forest green GREEN, gold YELLOW, red RED,
matching the verdict palette already in the build.

## 6. Site structure, page order

1. Hero: the manager-in-the-room line, one sentence of expansion, and the primary call to action (begin onboarding).
2. The problem: screenshot-and-a-lawsuit, the infinite-phrasings trap.
3. What we do: govern-the-decision-not-the-string, the verdict table, hash-chaining.
4. The live assistant: the chatbot, embedded, with presets. Visitors interact here.
5. Architecture and trust: on-prem, local, no cloud, prompts never stored, your compliance regime.
6. Why now: the model-pull lesson.
7. The engagement: the 90-day three-phase pilot.
8. Onboarding: the five-step on-site flow, ending in the scheduled call.
9. Who it is for: legal, insurance, healthcare, community banking.
10. Footer: company, contact, trust and security, Chatham-clean team framing (roles, C-level only).

## 7. Hosting and technical

- Domain: confirm whether the live target is the .io (currently live on Vercel) or a .com. Decide and point both at the same deploy.
- Repo: OakandSparrowSystemsEnterprises on GitHub, deploys from main via Vercel.
- The chatbot is a React build; embed it in the site rather than rebuilding it.
- No browser storage in the embedded build per platform constraints; keep chat state in memory.

**VERIFY:** Confirm the deploy domain (.io vs .com) before launch so DNS and the
repo point to one place.

> Build note: this repo targets **Railway** for the actual website build (per the
> current owner direction), implemented with Next.js. The chatbot is embedded as
> a React component and keeps its state in memory per the constraint above.

## 8. Build order for today

1. Lock the lead language (manager in the room) so copy is consistent.
2. Write the explainer sections from Section 2, they are architecture-independent and can be built now.
3. Build the onboarding flow from Section 4, the priority new capability.
4. Embed the chatbot from Section 5, public-build honesty footer in place.
5. Add architecture and trust copy from Section 3, kept general, figures gated.
6. Confirm domain, deploy, verify the live assistant and the onboarding scheduling link both work.

> Explain it, onboard them on-site, and let the assistant prove it live. Manager
> in the room, on their network, sealed record.
