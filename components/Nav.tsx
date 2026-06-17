import Link from "next/link";
import { company } from "@/content/site";

const links = [
  { href: "#what-we-do", label: "What we do" },
  { href: "#assistant", label: "Live assistant" },
  { href: "#architecture", label: "Architecture" },
  { href: "#engagement", label: "Engagement" },
  { href: "#onboarding", label: "Onboarding" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-forest/10 bg-parchment/85 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="#top" className="flex items-baseline gap-2">
          <span className="font-serif text-lg font-semibold text-forest">
            {company.short}
          </span>
          <span className="hidden font-sans text-[11px] uppercase tracking-[0.18em] text-gold-deep sm:inline">
            {company.product}
          </span>
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-sans text-sm text-forest/70 transition-colors hover:text-forest"
            >
              {l.label}
            </a>
          ))}
        </div>
        <a href="#onboarding" className="btn-gold">
          Begin onboarding
        </a>
      </nav>
    </header>
  );
}
