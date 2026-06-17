import { shift, verdicts, hashChain, outcomes } from "@/content/site";

const dot: Record<string, string> = {
  GREEN: "bg-verdict-green",
  YELLOW: "bg-verdict-yellow",
  RED: "bg-verdict-red",
};

export function WhatWeDo() {
  return (
    <section id="what-we-do" className="bg-paper-cool">
      <div className="section">
        <p className="eyebrow">What we do</p>
        <h2 className="h-section mt-3 max-w-3xl">{shift.heading}</h2>
        <p className="lede mt-6 max-w-prose">{shift.body}</p>

        {/* Verdict model */}
        <div className="mt-14">
          <h3 className="font-serif text-xl text-ink">
            Every action gets a verdict before it executes, and a sealed record after.
          </h3>
          <div className="mt-6 overflow-hidden rounded-sm border border-line bg-white">
            <table className="w-full text-left">
              <thead className="border-b border-line font-mono text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3">Verdict</th>
                  <th className="px-5 py-3">What happens</th>
                  <th className="hidden px-5 py-3 sm:table-cell">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {verdicts.map((v) => (
                  <tr key={v.thermal} className="align-top">
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-ink">
                        <span className={`h-2.5 w-2.5 rounded-full ${dot[v.thermal]}`} />
                        {v.thermal}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-ink-soft">{v.what}</td>
                    <td className="hidden px-5 py-4 text-muted sm:table-cell">
                      {v.example}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hash chaining */}
        <div className="mt-14 max-w-prose">
          <h3 className="font-serif text-xl text-ink">{hashChain.heading}</h3>
          <p className="mt-4 leading-relaxed text-ink-soft">{hashChain.body}</p>
        </div>

        {/* Outcomes */}
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {outcomes.map((o) => (
            <div key={o.title} className="rounded-sm border border-line bg-white p-6">
              <h4 className="font-serif text-lg text-ink">{o.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">{o.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
