import { architecture } from "@/content/site";

export function Architecture() {
  return (
    <section id="architecture" className="bg-paper">
      <div className="section">
        <p className="eyebrow">Architecture and trust</p>
        <h2 className="h-section mt-3 max-w-3xl">{architecture.heading}</h2>
        <ul className="mt-10 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
          {architecture.points.map((p, i) => (
            <li key={i} className="bg-white p-7">
              <span className="font-mono text-xs text-blue-deep">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 leading-relaxed text-ink-soft">{p}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
