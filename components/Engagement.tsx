import { engagement } from "@/content/site";

export function Engagement() {
  return (
    <section id="engagement" className="bg-paper-cool">
      <div className="section">
        <p className="eyebrow">The engagement</p>
        <h2 className="h-section mt-3 max-w-3xl">{engagement.heading}</h2>

        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {engagement.phases.map((p, i) => (
            <li
              key={p.name}
              className="relative rounded-sm border border-line bg-white p-6"
            >
              <span className="font-mono text-xs uppercase tracking-wider text-blue-deep">
                {p.window}
              </span>
              <h3 className="mt-2 font-serif text-xl text-ink">
                {i + 1}. {p.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{p.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-8 max-w-prose text-sm leading-relaxed text-muted">
          {engagement.pricingNote}
        </p>
      </div>
    </section>
  );
}
