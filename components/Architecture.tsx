import { architecture } from "@/content/site";

export function Architecture() {
  return (
    <section id="architecture" className="bg-forest text-parchment">
      <div className="section">
        <p className="eyebrow text-gold-soft">Architecture and trust</p>
        <h2 className="h-section mt-3 max-w-3xl">{architecture.heading}</h2>
        <ul className="mt-10 grid gap-px overflow-hidden rounded-sm border border-parchment/15 bg-parchment/15 sm:grid-cols-2">
          {architecture.points.map((p, i) => (
            <li key={i} className="bg-forest p-7">
              <span className="font-mono text-xs text-gold-soft">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 leading-relaxed text-parchment/90">{p}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
