# OASSE Chatbot Brain (Seam 2) - Install

Three files, three steps. No dependency on the CTO's Gatekeeper engine.
This is the answer engine only. The governance verdicts (Seam 1) are a separate wire.

## Files
- chat_route.ts  ->  app/api/chat/route.ts
- oasse_chatbot_knowledge_base.json  ->  content/oasse_chatbot_knowledge_base.json
- chat_widget_fetch_snippet.ts  ->  reference for wiring your chat UI

## Steps
1. Drop chat_route.ts at app/api/chat/route.ts
2. Drop the JSON at content/oasse_chatbot_knowledge_base.json
3. Set ANTHROPIC_API_KEY in Vercel (optional: CHAT_MODEL, defaults to claude-sonnet-4-6)

The chat UI must POST { messages: [...] } to /api/chat ending on a user turn.
See chat_widget_fetch_snippet.ts.

## What it does
- Answers ONLY from the knowledge base. Off-base questions get a handoff, never an invented answer.
- Honest degradation: if the key is not set, it returns the handoff instead of erroring,
  so you can ship before wiring the key.

## Hardening (built in)
- Per-IP rate limit, 12 req/min (in-memory; move to KV later for cross-instance guarantees)
- Input caps: 2000 chars/message, 20 messages, 12000 total
- History validation + prompt-injection guard in the system prompt
- 20s upstream timeout via AbortController

## Knowledge base design
- External-tier only. Contains nothing internal: no ownership, no individuals beyond the
  public leadership page, no exact pricing, no partner/pilot specifics, no research internals.
- The model cannot leak what is not in the file. The boundary is architectural, not a prompt rule.
- To update facts: edit the JSON entries. Keep the same shape (id, topics, question_intents, answer).

## Before flipping off "Coming Soon"
Throw 5-6 real investor/pilot questions at it. If any return the handoff, that is a gap,
add an entry for it. The 22 entries cover product, verdicts, architecture, data, pricing
structure, compliance, pilot, why-now, who-for, company, patent-pending, contact, and a
guard for off-topic/internal questions.
