import type { Metadata } from "next";
import { about, positioning, company } from "@/content/site";

export const metadata: Metadata = {
  title: `About — ${company.name}`,
  description:
    "Our story and the team building Oak & Sparrow. Governance built in public: honest, ethical, transparent. Founder Joshua Johosky and the team behind Gatekeeper.",
};

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-paper">
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-28">
          <p className="eyebrow">About Oak &amp; Sparrow</p>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.1] text-ink md:text-5xl">
            {positioning.mission}
          </h1>
          <p className="mt-6 font-mono text-sm uppercase tracking-[0.18em] text-blue-deep">
            {positioning.philosophy}
          </p>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted">{about.tagline}</p>
        </div>
      </section>

      {/* How we got here */}
      <section className="bg-paper-cool">
        <div className="section">
          <p className="eyebrow">Our story</p>
          <h2 className="h-section mt-3 max-w-3xl">{about.story.heading}</h2>
          <div className="mt-6 max-w-prose space-y-5">
            {about.story.paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed text-ink-soft">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* How we hold ourselves */}
      <section className="bg-paper">
        <div className="section">
          <p className="eyebrow">Our standard</p>
          <h2 className="h-section mt-3 max-w-3xl">{about.principles.heading}</h2>
          <p className="lede mt-6 max-w-prose">{about.principles.intro}</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {about.principles.items.map((it) => (
              <div key={it.title} className="rounded-sm border border-line bg-white p-6">
                <h3 className="font-serif text-lg text-ink">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{it.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The team */}
      <section id="team" className="bg-paper-cool">
        <div className="section">
          <p className="eyebrow">The team</p>
          <h2 className="h-section mt-3 max-w-3xl">{about.team.heading}</h2>
          <p className="lede mt-6 max-w-prose">{about.team.note}</p>

          <h3 className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-blue-deep">
            Founders
          </h3>
          <div className="mt-5 grid gap-6 md:grid-cols-3">
            {about.team.founders.map((m) => (
              <Person key={m.name} {...m} />
            ))}
          </div>

          <h3 className="mt-14 font-mono text-xs uppercase tracking-[0.2em] text-blue-deep">
            Advisors
          </h3>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            {about.team.advisors.map((m) => (
              <Person key={m.name} {...m} />
            ))}
          </div>
        </div>
      </section>

      {/* What we will not do */}
      <section className="bg-paper">
        <div className="section">
          <p className="eyebrow">Our line</p>
          <h2 className="h-section mt-3 max-w-3xl">{about.willNot.heading}</h2>
          <p className="lede mt-6 max-w-prose">{about.willNot.body}</p>
          <div className="mt-10">
            <a href="/#onboarding" className="btn-primary">
              Begin onboarding
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function Person({ name, role, bio }: { name: string; role: string; bio: string }) {
  return (
    <div className="rounded-sm border border-line bg-white p-6">
      <h4 className="font-serif text-lg text-ink">{name}</h4>
      <p className="mt-1 font-mono text-xs uppercase tracking-wider text-blue-deep">{role}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{bio}</p>
    </div>
  );
}
