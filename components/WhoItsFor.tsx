import { audiences } from "@/content/site";

export function WhoItsFor() {
  return (
    <section id="who-its-for" className="section">
      <p className="eyebrow">Who it is for</p>
      <h2 className="h-section mt-3 max-w-3xl">
        Built for firms that have to prove governance.
      </h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {audiences.map((a) => (
          <div key={a.name} className="border-t-2 border-gold pt-5">
            <h3 className="font-serif text-lg text-forest">{a.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-forest/80">{a.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
