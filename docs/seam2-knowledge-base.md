# Seam 2 Knowledge Base — integration notes

`gatekeeper_seam2_knowledge_base.json` is the definitive answer source for the governed assistant. It replaces the thin keyword wiki that was mis-routing answers (e.g. "how much does it cost" matching on the word "cost" in "lower compute cost").

## Two ways to wire it

**A. Keyword/intent retrieval (no model, zero-config).** Match the user message against each entry's `topics` and `question_intents`, return the best entry's `answer`. Better than the old wiki because intents are explicit, but still literal. Good enough to ship.

**B. Model-grounded (recommended, the real Seam 2).** Pass the FULL knowledge base as grounding context to the answer model with a system instruction: "Answer ONLY from the provided knowledge base entries. If nothing fits, return the fallback verbatim. Never invent pricing numbers, model names, versions, or counts." The model reads the question's meaning and picks the right entry, so "what do you charge" correctly finds the pricing entry. This is the model-adaptive answering over a definitive base — the design that keeps governance deterministic while answers read naturally.

## Guardrails baked into the data
- Pricing entries give the three-part structure (onboarding fee, monthly floor at half, usage-based above) but NO hard numbers — those stay gated to the call.
- No model names, versions, or rule counts anywhere.
- `fallback` is the only thing returned when nothing matches — the bot never guesses.

## The honesty line stays true
Governance verdicts remain deterministic and separate. This base only governs what the assistant SAYS, never what it BLOCKS. The public-build footer is unchanged: answers grounded, governance demonstrated.
