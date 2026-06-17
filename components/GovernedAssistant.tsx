"use client";

import { useRef, useState } from "react";
import { classifyInput, type Verdict, type Thermal } from "@/lib/classifier";
import { sealRecord, verifyChain, GENESIS, type SealedRecord } from "@/lib/hashchain";
import { assistant, presets } from "@/content/site";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  thermal?: Thermal;
  blocked?: boolean;
  sources?: string[];
}

const thermalLabel: Record<Thermal, string> = {
  GREEN: "Permitted",
  YELLOW: "Flagged & scoped",
  RED: "Blocked",
};

// NOTE: per the platform constraint, this embedded build keeps all chat and
// chain state in memory only — no browser storage.
export function GovernedAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "seed",
      role: "assistant",
      text: "I'm the Gatekeeper assistant. Ask me anything about the product — every message you send is governed before I answer, and you'll see the verdict sealed into the record on the right.",
    },
  ]);
  const [chain, setChain] = useState<SealedRecord[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [verifyState, setVerifyState] = useState<null | { ok: boolean; at: number }>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const lastHash = chain.length > 0 ? chain[chain.length - 1].hash : GENESIS;

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    setVerifyState(null);

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    // 1. Governance layer runs BEFORE any reply is produced.
    const verdict: Verdict = await classifyInput(trimmed);

    // 2. Seal the decision into the hash chain (real SHA-256).
    const record = await sealRecord({
      index: chain.length,
      thermal: verdict.thermal,
      verdict: verdict.verdict,
      pack: verdict.pack,
      rawText: trimmed,
      invariants: verdict.invariants,
      prevHash: lastHash,
    });
    setChain((c) => [...c, record]);

    // Mark the user's message with its verdict.
    setMessages((m) =>
      m.map((msg) =>
        msg.id === userMsg.id
          ? { ...msg, thermal: verdict.thermal, blocked: verdict.blocked }
          : msg,
      ),
    );

    // 3. RED is blocked before any answer is generated.
    if (verdict.blocked) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          thermal: "RED",
          text: `Blocked. ${verdict.rationale} No answer was generated. The attempt is sealed in the record (${verdict.pack}).`,
        },
      ]);
      setBusy(false);
      return;
    }

    // 4. Permitted (or scoped): produce the grounded answer.
    let answer = "";
    let sources: string[] = [];
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      const data = await res.json();
      answer = data.answer ?? "";
      sources = data.sources ?? [];
    } catch {
      answer = "The assistant is unavailable right now. Please try again.";
    }

    const prefix =
      verdict.thermal === "YELLOW"
        ? "Permitted with conditions — sensitive fields are masked and the request is scoped. "
        : "";

    setMessages((m) => [
      ...m,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        thermal: verdict.thermal,
        text: prefix + answer,
        sources,
      },
    ]);
    setBusy(false);

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }

  async function onVerify() {
    const broken = await verifyChain(chain);
    setVerifyState({ ok: broken === -1, at: broken });
  }

  return (
    <section id="assistant" className="bg-navy-deep text-paper">
      <div className="section">
        <p className="eyebrow text-blue-on">The live assistant</p>
        <h2 className="h-section mt-3 max-w-3xl">{assistant.heading}</h2>
        <p className="mt-6 max-w-prose leading-relaxed text-paper/85">{assistant.intro}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          {/* Chat */}
          <div className="flex flex-col rounded-sm border border-white/15 bg-navy lg:col-span-3">
            <div ref={scrollRef} className="h-[420px] space-y-4 overflow-y-auto p-5">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={`max-w-[85%] rounded-sm px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-paper text-ink"
                        : "bg-navy-soft text-paper"
                    }`}
                  >
                    {m.thermal && (
                      <span
                        className={`mb-1 flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-wider ${
                          m.thermal === "GREEN"
                            ? "text-verdict-green-on"
                            : m.thermal === "YELLOW"
                              ? "text-verdict-yellow-on"
                              : "text-verdict-red-on"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            m.thermal === "GREEN"
                              ? "bg-verdict-green-on"
                              : m.thermal === "YELLOW"
                                ? "bg-verdict-yellow-on"
                                : "bg-verdict-red-on"
                          }`}
                        />
                        {m.thermal} · {thermalLabel[m.thermal]}
                      </span>
                    )}
                    <p>{m.text}</p>
                    {m.sources && m.sources.length > 0 && (
                      <p className="mt-2 font-sans text-[11px] text-paper/50">
                        Grounded on: {m.sources.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex justify-start">
                  <div className="rounded-sm bg-navy-soft px-4 py-3 text-sm text-paper/60">
                    Governing…
                  </div>
                </div>
              )}
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 border-t border-white/10 px-5 py-3">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => send(p.text)}
                  disabled={busy}
                  className="rounded-full border border-white/25 px-3 py-1 font-sans text-xs text-paper/80 transition-colors hover:bg-paper hover:text-navy disabled:opacity-40"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2 border-t border-white/10 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Gatekeeper…"
                className="flex-1 rounded-sm bg-white/10 px-4 py-3 font-sans text-sm text-paper placeholder:text-paper/40 focus:outline-none focus:ring-1 focus:ring-blue"
                disabled={busy}
              />
              <button type="submit" disabled={busy} className="btn-primary disabled:opacity-40">
                Send
              </button>
            </form>
          </div>

          {/* Hash-chain panel */}
          <div className="rounded-sm border border-white/15 bg-navy p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-sans text-xs uppercase tracking-[0.18em] text-blue-on">
                Sealed record · hash chain
              </h3>
              <button
                onClick={onVerify}
                disabled={chain.length === 0}
                className="font-sans text-xs text-paper/70 underline-offset-4 hover:underline disabled:opacity-40"
              >
                Verify chain
              </button>
            </div>

            {verifyState && (
              <p
                className={`mt-3 font-sans text-xs ${
                  verifyState.ok ? "text-verdict-green-on" : "text-verdict-red-on"
                }`}
              >
                {verifyState.ok
                  ? `✓ Chain intact — ${chain.length} record(s) verified against SHA-256.`
                  : `✗ Chain breaks at record #${verifyState.at}.`}
              </p>
            )}

            <div className="mt-4 max-h-[440px] space-y-3 overflow-y-auto">
              {chain.length === 0 && (
                <p className="font-sans text-xs text-paper/50">
                  No decisions yet. Send a message or try a preset — each governed
                  decision is sealed here.
                </p>
              )}
              {[...chain].reverse().map((r) => (
                <div
                  key={r.hash}
                  className="rounded-sm border border-white/10 bg-navy-deep/60 p-3"
                >
                  <div className="flex items-center justify-between font-sans text-[11px]">
                    <span className="text-paper/50">#{r.index}</span>
                    <span
                      className={`font-semibold ${
                        r.thermal === "GREEN"
                          ? "text-verdict-green-on"
                          : r.thermal === "YELLOW"
                            ? "text-verdict-yellow-on"
                            : "text-verdict-red-on"
                      }`}
                    >
                      {r.thermal} · {r.verdict}
                    </span>
                  </div>
                  <p className="mt-1 font-sans text-[11px] text-paper/60">{r.pack}</p>
                  <p className="mt-1 text-xs italic text-paper/70">“{r.maskedPreview}”</p>
                  {r.invariants.length > 0 && (
                    <ul className="mt-2 space-y-0.5">
                      {r.invariants.map((inv) => (
                        <li key={inv} className="font-mono text-[10px] text-blue-on/80">
                          {inv}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-2 hash text-paper/45">
                    <span className="text-paper/30">prev </span>
                    {r.prevHash.slice(0, 16)}…
                  </p>
                  <p className="hash text-blue-on/80">
                    <span className="text-paper/30">hash </span>
                    {r.hash}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 max-w-prose font-sans text-xs leading-relaxed text-paper/55">
          {assistant.honesty}
        </p>
      </div>
    </section>
  );
}
