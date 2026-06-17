import { whyNow } from "@/content/site";

export function WhyNow() {
  return (
    <section id="why-now" className="section">
      <p className="eyebrow">Why now</p>
      <h2 className="h-section mt-3">{whyNow.heading}</h2>
      <p className="lede mt-6 max-w-prose">{whyNow.body}</p>
    </section>
  );
}
