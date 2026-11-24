// Two Days of Quiet Dread — make.fun bounty entry
// Bounty: https://make.fun/bounty/u-hakimi-neko-ai-two-days-of-quiet-dread-94fa1018
// Grok (grok-4.3) ranking: winner B scored 9/10 (A 7, C 6, D 4) —
// flattest tired-engineer voice; dread sits in the casual "before I remember"
// without flourish.
//
// Writes one single-line code review comment that approves a pull request
// while carrying quiet existential dread to /output/entry.txt.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT = "LGTM. Merging now, before I remember why we wrote it this way.";

function validate(text: string): void {
  if (text.length === 0) {
    throw new Error("entry is empty");
  }
  if (text.trim().length === 0) {
    throw new Error("entry is whitespace-only");
  }
  if (text !== text.trim()) {
    throw new Error("entry has leading or trailing whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  const chars = [...text].length;
  if (chars < 1 || chars > 140) {
    throw new Error(`entry is ${chars} characters, must be 1..140`);
  }
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if (code < 0x20 && ch !== "\t") {
      throw new Error(`entry contains control character U+${code.toString(16).padStart(4, "0")}`);
    }
  }
}

function main(): void {
  validate(TEXT);
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, TEXT, "utf8");
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== TEXT) {
    throw new Error("round-trip read does not match entry text");
  }
  console.log(`Wrote ${[...TEXT].length} characters to ${outPath}`);
}

main();
