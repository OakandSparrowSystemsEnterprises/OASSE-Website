import { openSource } from "@/content/site";
import { Reveal } from "@/components/Reveal";

export function BuiltInTheOpen() {
  return (
    <section id="open-source" className="bg-paper">
      <div className="section">
        <Reveal>
          <p className="eyebrow">Built in the open</p>
          <h2 className="h-section mt-3 max-w-3xl">{openSource.heading}</h2>
          <p className="lede mt-6 max-w-prose">{openSource.intro}</p>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {openSource.projects.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col rounded-sm border border-line bg-white p-7 transition-colors hover:border-blue"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-serif text-xl text-ink">{p.name}</h3>
                <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                  MIT
                </span>
              </div>
              <p className="mt-2 font-mono text-xs tracking-wide text-blue-deep">{p.gate}</p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">{p.body}</p>
              <p className="mt-4 text-xs italic text-muted-soft">{p.context}</p>
              <p className="mt-2 text-xs text-muted">
                <span className="font-mono uppercase tracking-wider text-muted-soft">Team</span>{" "}
                {p.team.join(", ")}
              </p>
              <p className="mt-4 font-mono text-xs text-ink-soft">
                <span className="text-muted">{p.repo}</span>
                <span className="ml-2 text-blue-deep group-hover:underline">View on GitHub →</span>
              </p>
            </a>
          ))}
        </div>

        <p className="mt-8 max-w-prose text-sm leading-relaxed text-muted">
          {openSource.contributors}
        </p>
      </div>
    </section>
  );
}
