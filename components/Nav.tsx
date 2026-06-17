import Link from "next/link";
import { company } from "@/content/site";

const links = [
  { href: "#what-we-do", label: "What we do" },
  { href: "#assistant", label: "Live assistant" },
  { href: "#architecture", label: "Architecture" },
  { href: "#engagement", label: "Engagement" },
  { href: "#open-source", label: "Open source" },
  { href: "#onboarding", label: "Onboarding" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link href="#top" className="flex items-baseline gap-2">
          <span className="whitespace-nowrap font-serif text-lg font-semibold text-ink">
            {company.short}
          </span>
          <span className="hidden whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.18em] text-blue-deep lg:inline">
            {company.product}
          </span>
        </Link>
        <div className="hidden items-center gap-5 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap font-mono text-sm text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>
        <a href="#onboarding" className="btn-primary whitespace-nowrap">
          Begin onboarding
        </a>
      </nav>
    </header>
  );
}
