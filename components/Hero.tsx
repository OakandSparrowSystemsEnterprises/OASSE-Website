import { positioning } from "@/content/site";
import { Reveal } from "@/components/Reveal";
import { LiveLedger } from "@/components/LiveLedger";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-paper">
      {/* Soft cool wash, architectural not illustrative. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(900px 500px at 70% -10%, rgba(111,144,168,0.16), transparent 60%)",
        }}
      />
      <div className="relative mx-auto grid max-w-5xl items-center gap-12 px-6 py-24 md:py-28 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <p className="eyebrow">{positioning.mission}</p>
          <h1 className="mt-6 max-w-2xl font-serif text-4xl leading-[1.08] text-ink md:text-6xl">
            {positioning.lead}
          </h1>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted md:text-xl">
            {positioning.leadExpansion}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#onboarding" className="btn-primary">
              Begin onboarding
            </a>
            <a href="#assistant" className="btn-ghost">
              See it govern itself
            </a>
          </div>
          <p className="mt-10 font-mono text-sm uppercase tracking-[0.18em] text-muted-soft">
            {positioning.philosophy}
          </p>
        </Reveal>

        {/* Signature moment: the live sealed ledger. Hidden on small screens to
            keep the mobile hero clean. */}
        <Reveal className="hidden lg:block" delayMs={120}>
          <LiveLedger />
        </Reveal>
      </div>
    </section>
  );
}
