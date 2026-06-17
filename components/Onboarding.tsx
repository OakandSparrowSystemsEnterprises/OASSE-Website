"use client";

import { useEffect, useState } from "react";
import { onboardingSteps, engagement } from "@/content/site";

interface FormState {
  industry: string;
  regime: string;
  volume: string;
  tools: string;
  name: string;
  company: string;
  email: string;
}

const EMPTY: FormState = {
  industry: "",
  regime: "",
  volume: "",
  tools: "",
  name: "",
  company: "",
  email: "",
};

const STORAGE_KEY = "oasse_onboarding_v1";
const SCHEDULING_URL =
  process.env.NEXT_PUBLIC_SCHEDULING_URL ||
  "https://calendly.com/nicksilva-oakandsparrowsystemsenterprise/30min";

// Maps the qualifying answers to a policy-pack starting point and what the
// shadow audit would observe — "the moment the visitor sees the product is
// built for them specifically."
const PACKS: Record<string, { pack: string; observes: string }> = {
  Healthcare: {
    pack: "HIPAA / PHI",
    observes:
      "where PHI — diagnoses, medications, MRNs — would reach an AI tool, so it can be masked and the disclosure rules enforced.",
  },
  "Community banking": {
    pack: "Financial Controls",
    observes:
      "where account numbers, balances, and wire instructions flow toward AI, so high-value and bulk actions are scoped before they run.",
  },
  Legal: {
    pack: "Legal / Privilege",
    observes:
      "where privileged and client-confidential material would be pasted into AI, so it never leaves your boundary unsealed.",
  },
  Insurance: {
    pack: "PII Protection",
    observes:
      "where claimant PII and policy data reach AI tools, so identifiers are masked and exfiltration is blocked.",
  },
  Other: {
    pack: "Baseline + custom pack",
    observes:
      "where sensitive data in your workflows reaches AI, so we can derive a policy pack from the rules that govern you.",
  },
};

const INDUSTRIES = Object.keys(PACKS);
const REGIMES = ["HIPAA", "Financial / GLBA", "Legal / privilege", "FERPA", "Other / mixed"];
const VOLUMES = ["Under 50 staff", "50–250 staff", "250–1,000 staff", "Over 1,000 staff"];

export function Onboarding() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [resumed, setResumed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Save-and-resume: a serious prospect can complete in one sitting or return.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { form: FormState; step: number };
        if (saved.form) {
          setForm({ ...EMPTY, ...saved.form });
          setStep(Math.min(saved.step || 1, 4));
          setResumed(true);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, step }));
    } catch {
      /* ignore */
    }
  }, [form, step]);

  const fit = PACKS[form.industry] ?? PACKS.Other;
  const set = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const canQualify = form.industry && form.regime && form.volume;
  const canCapture = form.company.trim() && /\S+@\S+\.\S+/.test(form.email);

  async function submitLead() {
    setSubmitting(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pack: fit.pack }),
      });
      setSubmitted(true);
      setStep(5);
    } catch {
      // Still advance — the scheduling link is the real conversion action.
      setStep(5);
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setForm(EMPTY);
    setStep(1);
    setSubmitted(false);
    setResumed(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  return (
    <section id="onboarding" className="bg-paper-cool">
      <div className="section">
        <p className="eyebrow">Onboarding</p>
        <h2 className="h-section mt-3 max-w-3xl">Begin onboarding, no sales call required.</h2>
        <p className="lede mt-6 max-w-prose">
          Qualify, see the fit, and book your onboarding call — right here. We
          route a warm, informed start straight into setup.
        </p>

        {/* Stepper */}
        <ol className="mt-10 flex flex-wrap gap-2">
          {onboardingSteps.map((s) => {
            const state = s.n === step ? "current" : s.n < step ? "done" : "todo";
            return (
              <li
                key={s.n}
                className={`flex items-center gap-2 rounded-sm border px-3 py-2 font-sans text-xs ${
                  state === "current"
                    ? "border-blue bg-blue text-white"
                    : state === "done"
                      ? "border-blue/40 bg-blue/10 text-ink"
                      : "border-line text-muted-soft"
                }`}
              >
                <span className="font-semibold">{state === "done" ? "✓" : s.n}</span>
                {s.title}
              </li>
            );
          })}
        </ol>

        {resumed && step < 5 && !submitted && (
          <p className="mt-4 font-sans text-xs text-blue-deep">
            Welcome back — we restored your progress.{" "}
            <button onClick={reset} className="underline underline-offset-2">
              Start over
            </button>
          </p>
        )}

        <div className="mt-8 rounded-sm border border-line bg-white p-7 md:p-10">
          {/* Step 1 — Qualify */}
          {step === 1 && (
            <div>
              <h3 className="font-serif text-2xl text-ink">1 · Qualify</h3>
              <p className="mt-2 text-sm text-muted">{onboardingSteps[0].blurb}</p>

              <Field label="Your industry">
                <Choices options={INDUSTRIES} value={form.industry} onPick={(v) => set("industry", v)} />
              </Field>
              <Field label="Compliance regime">
                <Choices options={REGIMES} value={form.regime} onPick={(v) => set("regime", v)} />
              </Field>
              <Field label="Rough size">
                <Choices options={VOLUMES} value={form.volume} onPick={(v) => set("volume", v)} />
              </Field>
              <Field label="Current AI tools in use (optional)">
                <input
                  value={form.tools}
                  onChange={(e) => set("tools", e.target.value)}
                  placeholder="e.g. ChatGPT, Copilot, internal models"
                  className="w-full rounded-sm border border-line bg-white px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:ring-1 focus:ring-blue"
                />
              </Field>

              <div className="mt-8">
                <button
                  className="btn-primary disabled:opacity-40"
                  disabled={!canQualify}
                  onClick={() => setStep(2)}
                >
                  See the fit →
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — Show the fit */}
          {step === 2 && (
            <div>
              <h3 className="font-serif text-2xl text-ink">2 · Your fit</h3>
              <div className="mt-6 rounded-sm border border-blue/40 bg-blue/10 p-6">
                <p className="font-sans text-xs uppercase tracking-wider text-blue-deep">
                  Recommended policy pack
                </p>
                <p className="mt-1 font-serif text-2xl text-ink">{fit.pack}</p>
                <p className="mt-4 leading-relaxed text-ink-soft">
                  During the shadow audit, Gatekeeper would observe {fit.observes}
                </p>
              </div>
              <NavRow onBack={() => setStep(1)} onNext={() => setStep(3)} nextLabel="The engagement →" />
            </div>
          )}

          {/* Step 3 — Explain the engagement */}
          {step === 3 && (
            <div>
              <h3 className="font-serif text-2xl text-ink">3 · The engagement</h3>
              <p className="mt-2 text-sm text-muted">{onboardingSteps[2].blurb}</p>
              <ol className="mt-6 space-y-4">
                {engagement.phases.map((p, i) => (
                  <li key={p.name} className="flex gap-4">
                    <span className="font-mono text-xs text-blue-deep">{p.window}</span>
                    <div>
                      <p className="font-serif text-lg text-ink">
                        {i + 1}. {p.name}
                      </p>
                      <p className="text-sm text-muted">{p.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 max-w-prose text-sm text-muted">{engagement.pricingNote}</p>
              <NavRow onBack={() => setStep(2)} onNext={() => setStep(4)} nextLabel="Your details →" />
            </div>
          )}

          {/* Step 4 — Capture */}
          {step === 4 && (
            <div>
              <h3 className="font-serif text-2xl text-ink">4 · Your details</h3>
              <p className="mt-2 text-sm text-muted">{onboardingSteps[3].blurb}</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Name">
                  <Text value={form.name} onChange={(v) => set("name", v)} placeholder="Jane Doe" />
                </Field>
                <Field label="Company *">
                  <Text value={form.company} onChange={(v) => set("company", v)} placeholder="Acme Health" />
                </Field>
                <Field label="Work email *">
                  <Text value={form.email} onChange={(v) => set("email", v)} placeholder="jane@acme.com" type="email" />
                </Field>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button className="btn-ghost" onClick={() => setStep(3)}>
                  ← Back
                </button>
                <button
                  className="btn-primary disabled:opacity-40"
                  disabled={!canCapture || submitting}
                  onClick={submitLead}
                >
                  {submitting ? "Saving…" : "Continue to scheduling →"}
                </button>
              </div>
            </div>
          )}

          {/* Step 5 — Confirm and hand off */}
          {step === 5 && (
            <div className="text-center">
              <p className="font-sans text-xs uppercase tracking-[0.18em] text-blue-deep">
                Confirmed
              </p>
              <h3 className="mt-2 font-serif text-2xl text-ink">
                You&apos;re set{form.name ? `, ${form.name.split(" ")[0]}` : ""}.
              </h3>
              <p className="mx-auto mt-4 max-w-prose leading-relaxed text-muted">
                Book your onboarding call below. Next: an NDA, hardware
                provisioning funded by onboarding, and your{" "}
                <strong>{fit.pack}</strong> policy pack built during the shadow
                window. Enforcement begins at day 16 on the installed executable.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a href={SCHEDULING_URL} target="_blank" rel="noreferrer" className="btn-primary">
                  Book the onboarding call →
                </a>
                <button onClick={reset} className="btn-ghost">
                  Start a new onboarding
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── small presentational helpers ─────────────────────────────────────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-6 block">
      <span className="font-sans text-sm font-medium text-ink">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Choices({
  options,
  value,
  onPick,
}: {
  options: string[];
  value: string;
  onPick: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onPick(o)}
          className={`rounded-sm border px-4 py-2 font-sans text-sm transition-colors ${
            value === o
              ? "border-blue bg-blue text-white"
              : "border-line text-muted hover:border-blue"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Text({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-sm border border-line bg-white px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:ring-1 focus:ring-blue"
    />
  );
}

function NavRow({
  onBack,
  onNext,
  nextLabel,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}) {
  return (
    <div className="mt-8 flex gap-4">
      <button className="btn-ghost" onClick={onBack}>
        ← Back
      </button>
      <button className="btn-primary" onClick={onNext}>
        {nextLabel}
      </button>
    </div>
  );
}
