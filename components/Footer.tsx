import { company, positioning, links, openSource } from "@/content/site";

// LinkedIn renders only when set (YOU SET item — confirm the page first).
const linkedIn = process.env.NEXT_PUBLIC_LINKEDIN_URL;

// Chatham-clean team framing: roles, C-level only. No names.
const team = [
  { role: "Chief Executive Officer" },
  { role: "Chief Technology Officer" },
  { role: "Chief Operating Officer" },
];

export function Footer() {
  return (
    <footer className="border-t border-navy-deep bg-navy text-paper">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-serif text-lg font-semibold">{company.name}</p>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-paper/75">
            {positioning.mission} {positioning.philosophy}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs">
            <a
              href={links.githubOrg}
              target="_blank"
              rel="noreferrer"
              className="text-blue-on underline-offset-4 hover:underline"
            >
              GitHub
            </a>
            {linkedIn && (
              <a
                href={linkedIn}
                target="_blank"
                rel="noreferrer"
                className="text-blue-on underline-offset-4 hover:underline"
              >
                LinkedIn
              </a>
            )}
            <a
              href={`mailto:${company.email}`}
              className="text-blue-on underline-offset-4 hover:underline"
            >
              {company.email}
            </a>
          </div>
        </div>

        <div className="md:col-span-3">
          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-blue-on">
            Trust &amp; security
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-paper/80">
            <li>On-premises. No cloud in the decision path.</li>
            <li>Prompts are never stored.</li>
            <li>Hash-chained, tamper-evident records.</li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-blue-on">
            Team
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-paper/80">
            {team.map((t) => (
              <li key={t.role}>{t.role}</li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-blue-on">
            Open source
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-paper/80">
            {openSource.projects.map((p) => (
              <li key={p.name}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 hover:text-blue-on hover:underline"
                >
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <p className="text-xs leading-relaxed text-paper/60">
            On this site, answers are live and grounded on our company wiki. The
            governance verdicts are a demonstration: a rules-based classifier runs
            in your browser and seals a real SHA-256 hash chain you can verify. This
            honesty is the brand.
          </p>
          <p className="mt-3 text-xs text-paper/50">
            © {new Date().getFullYear()} {company.name}. Hash chaining, never blockchain.
          </p>
        </div>
      </div>
    </footer>
  );
}
