/**
 * Hash chaining — NOT blockchain. (Locked across all copy.)
 *
 * Every governed decision is sealed with a SHA-256 hash that includes the
 * hash of the record before it. Change any record and the chain breaks
 * visibly. No network, no token, no consensus overhead — just a
 * tamper-evident ledger the visitor can verify in their own browser.
 *
 * This uses the Web Crypto API (crypto.subtle), so the hashes shown in the
 * demonstration panel are REAL SHA-256 digests, not mock strings.
 */

import type { Thermal } from "./classifier";

export interface SealedRecord {
  index: number;
  /** ISO timestamp of the seal. */
  timestamp: string;
  thermal: Thermal;
  verdict: string;
  pack: string;
  /**
   * Masked preview only. Sensitive identifiers (SSNs, card numbers, emails…)
   * are redacted here and never persisted — mirroring the product, where
   * prompts are never stored and identifiers never persist anywhere.
   */
  maskedPreview: string;
  invariants: string[];
  /** Hash of the previous record (GENESIS for the first). */
  prevHash: string;
  /** SHA-256 over prevHash + the canonical record body. */
  hash: string;
}

export const GENESIS = "GENESIS";

/** Redact the things that must never persist before anything is sealed. */
export function maskSensitive(text: string): string {
  return text
    .replace(/\b\d{3}[-.\s]\d{2}[-.\s]\d{4}\b/g, "•••-••-••••") // SSN
    .replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, "•••• •••• •••• ••••") // card
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, "•••@•••") // email
    .replace(/\b(sk-[A-Za-z0-9]{6,}|ghp_[A-Za-z0-9_]{6,}|AKIA[A-Z0-9]{6,})\b/g, "••••••••"); // secrets
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface SealInput {
  index: number;
  thermal: Thermal;
  verdict: string;
  pack: string;
  rawText: string;
  invariants: string[];
  prevHash: string;
}

/** Seal a decision into a record, chaining it to the previous hash. */
export async function sealRecord(input: SealInput): Promise<SealedRecord> {
  const timestamp = new Date().toISOString();
  const maskedPreview =
    maskSensitive(input.rawText).slice(0, 120) + (input.rawText.length > 120 ? "…" : "");

  // Canonical body — deterministic so the visitor can recompute it.
  const body = JSON.stringify({
    index: input.index,
    timestamp,
    thermal: input.thermal,
    verdict: input.verdict,
    pack: input.pack,
    maskedPreview,
    invariants: input.invariants,
  });

  const hash = await sha256Hex(input.prevHash + body);

  return {
    index: input.index,
    timestamp,
    thermal: input.thermal,
    verdict: input.verdict,
    pack: input.pack,
    maskedPreview,
    invariants: input.invariants,
    prevHash: input.prevHash,
    hash,
  };
}

/**
 * Re-walk a chain and report the first index where it breaks, or -1 if the
 * whole chain verifies. This is what powers the "Verify chain" button.
 */
export async function verifyChain(records: SealedRecord[]): Promise<number> {
  let prev = GENESIS;
  for (const r of records) {
    const body = JSON.stringify({
      index: r.index,
      timestamp: r.timestamp,
      thermal: r.thermal,
      verdict: r.verdict,
      pack: r.pack,
      maskedPreview: r.maskedPreview,
      invariants: r.invariants,
    });
    const expected = await sha256Hex(prev + body);
    if (expected !== r.hash || prev !== r.prevHash) return r.index;
    prev = r.hash;
  }
  return -1;
}
