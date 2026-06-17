import { problem } from "@/content/site";

export function ProblemSection() {
  return (
    <section id="problem" className="section">
      <p className="eyebrow">The problem</p>
      <h2 className="h-section mt-3 max-w-3xl">{problem.heading}</h2>
      <p className="lede mt-6 max-w-prose">{problem.body}</p>
    </section>
  );
}
