"use client";

import { useEffect, useState } from "react";

/**
 * The hero's signature "living sealed ledger": verdicts stream in and blocks
 * seal with moving hashes, live. It demonstrates the product (govern, then
 * seal a tamper-evident record) rather than decorating the page. Reduced-motion
 * users get the static seed, no ticking. Lightweight: DOM rows + one interval,
 * no canvas, no dependency.
 */

type Thermal = "GREEN" | "YELLOW" | "RED";
interface Row {
  id: number;
  n: number;
  thermal: Thermal;
  hex: string;
  fresh?: boolean;
}

// Deterministic seed → identical SSR and first client render (no hydration
// mismatch). Mirrors the original spec's "SEALED LEDGER · LIVE" aside.
const SEED: Row[] = [
  { id: 1, n: 118, thermal: "GREEN", hex: "a3f9c2" },
  { id: 2, n: 119, thermal: "GREEN", hex: "7b1e44" },
  { id: 3, n: 120, thermal: "YELLOW", hex: "e0c8a1" },
  { id: 4, n: 121, thermal: "RED", hex: "blocked" },
  { id: 5, n: 122, thermal: "GREEN", hex: "4d9f70" },
];

const dot: Record<Thermal, string> = {
  GREEN: "bg-verdict-green-on",
  YELLOW: "bg-verdict-yellow-on",
  RED: "bg-verdict-red-on",
};
const text: Record<Thermal, string> = {
  GREEN: "text-verdict-green-on",
  YELLOW: "text-verdict-yellow-on",
  RED: "text-verdict-red-on",
};

function randomHex(): string {
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Weighted so the stream feels real: mostly permitted, some scoped, rare block.
function nextThermal(): Thermal {
  const r = Math.random();
  if (r < 0.72) return "GREEN";
  if (r < 0.92) return "YELLOW";
  return "RED";
}

export function LiveLedger() {
  const [rows, setRows] = useState<Row[]>(SEED);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = 1000;
    const tick = setInterval(() => {
      setRows((prev) => {
        const top = prev[0];
        const thermal = nextThermal();
        const row: Row = {
          id: id++,
          n: top.n + 1,
          thermal,
          hex: thermal === "RED" ? "blocked" : randomHex(),
          fresh: true,
        };
        return [row, ...prev.slice(0, 4)].map((r, i) =>
          i === 0 ? r : { ...r, fresh: false },
        );
      });
    }, 1700);
    return () => clearInterval(tick);
  }, []);

  return (
    <div className="rounded-md border border-navy-deep bg-navy p-5 shadow-[0_24px_60px_-24px_rgba(36,50,64,0.55)]">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-blue-on">
          Sealed ledger · live
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-paper/60">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-verdict-green-on" />
          active
        </span>
      </div>

      <ul className="mt-4 space-y-2">
        {rows.map((r) => (
          <li
            key={r.id}
            className={`flex items-center gap-3 border-b border-white/5 pb-2 font-mono text-xs ${
              r.fresh ? "ledger-row-new" : ""
            }`}
          >
            <span className={`h-2 w-2 flex-none rounded-full ${dot[r.thermal]}`} />
            <span className={`w-16 font-semibold tracking-wide ${text[r.thermal]}`}>
              {r.thermal}
            </span>
            <span className="text-paper/40">#{r.n}</span>
            <span className="ml-auto text-paper/55">
              {r.hex === "blocked" ? (
                <span className="text-verdict-red-on/80">blocked</span>
              ) : (
                <>
                  <span className="text-paper/30">seal </span>
                  {r.hex}…
                </>
              )}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 font-mono text-[10px] italic tracking-wide text-paper/45">
        chain verified · prompts never stored
      </p>
    </div>
  );
}
