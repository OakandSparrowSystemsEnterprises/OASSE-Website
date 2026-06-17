import { company, positioning } from "@/content/site";

// Chatham-clean team framing: roles, C-level only. No names.
const team = [
  { role: "Chief Executive Officer" },
  { role: "Chief Technology Officer" },
  { role: "Chief Operating Officer" },
];

export function Footer() {
  return (
    <footer className="border-t border-forest/10 bg-forest text-parchment">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif text-lg font-semibold">{company.name}</p>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-parchment/75">
            {positioning.mission} {positioning.philosophy}
          </p>
        </div>

        <div>
          <h3 className="font-sans text-xs uppercase tracking-[0.18em] text-gold-soft">
            Trust &amp; security
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-parchment/80">
            <li>On-premises. No cloud in the decision path.</li>
            <li>Prompts are never stored.</li>
            <li>Hash-chained, tamper-evident records.</li>
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-xs uppercase tracking-[0.18em] text-gold-soft">
            Team
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-parchment/80">
            {team.map((t) => (
              <li key={t.role}>{t.role}</li>
            ))}
          </ul>
          <a
            href={`mailto:${company.email}`}
            className="mt-4 inline-block text-sm text-gold-soft underline-offset-4 hover:underline"
          >
            {company.email}
          </a>
        </div>
      </div>

      <div className="border-t border-parchment/10">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <p className="text-xs leading-relaxed text-parchment/60">
            On this site, answers are live and grounded on our company wiki. The
            governance verdicts are a demonstration: a rules-based classifier runs
            in your browser and seals a real SHA-256 hash chain you can verify. This
            honesty is the brand.
          </p>
          <p className="mt-3 text-xs text-parchment/50">
            © {new Date().getFullYear()} {company.name}. Hash chaining, never blockchain.
          </p>
        </div>
      </div>
    </footer>
  );
}
