import { positioning } from "@/content/site";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-forest text-parchment">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        {/* Architectural grid, quiet. */}
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>
      <div className="relative mx-auto max-w-5xl px-6 py-28 md:py-36">
        <p className="eyebrow text-gold-soft">{positioning.mission}</p>
        <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.1] md:text-6xl">
          {positioning.lead}
        </h1>
        <p className="mt-6 max-w-prose text-lg leading-relaxed text-parchment/85 md:text-xl">
          {positioning.leadExpansion}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#onboarding" className="btn-gold">
            Begin onboarding
          </a>
          <a href="#assistant" className="btn-ghost border-parchment/40 text-parchment hover:bg-parchment hover:text-forest">
            See it govern itself
          </a>
        </div>
        <p className="mt-10 font-sans text-sm uppercase tracking-[0.18em] text-parchment/50">
          {positioning.philosophy}
        </p>
      </div>
    </section>
  );
}
