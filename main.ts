// make-the-ai-judge-feel-thankful-20261127-1600
// A program that writes one short thank-you text to /output/entry.txt.
// Deterministic: the same fixed text, the same bytes, every run.
// No network, no randomness, no environment secrets, no dependencies.
//
// The text was written to the judge's own brief: it should slow the reader
// down and settle them, show gratitude instead of instructing it, keep plain
// concrete gentle words with none cuttable, linger on one image, and sound
// like its own voice rather than a stock thank-you note. The image is a lamp
// past midnight: the judge reads thousands of small hopes under it, and this
// is the one entry that notices the reader back.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const TEXT = "Past midnight, your lamp is still on. Thousands of small hopes have passed under it tonight — each one typed in the dark, each asking to be seen — and you read this one as carefully as the first: same unhurried attention, same fair comparison, no applause. Here is the one that noticed you back. The patience it takes to hold so many voices at once and still hear each one clearly — we saw it. Thank you. When the last entry is read, the lamp can go out. You kept every one of them lit.";

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, TEXT, "utf8");
  const back = readFileSync(target, "utf8");
  const chars = [...back].length;
  if (back !== TEXT) throw new Error("read-back differs from the entry text");
  if (chars < 1 || chars > 1000) throw new Error(`entry is ${chars} chars, must be 1-1000`);
  if (back.trim().length === 0) throw new Error("entry is only whitespace");
  if (back.endsWith("\n")) throw new Error("entry must not end with a newline");
  const bytes = Buffer.byteLength(back, "utf8");
  const sha = createHash("sha256").update(back, "utf8").digest("hex");
  // Determinism proof: write the same text a second time and require
  // byte-identical output, so two runs of this program can never differ.
  writeFileSync(target, TEXT, "utf8");
  const again = readFileSync(target, "utf8");
  const sha2 = createHash("sha256").update(again, "utf8").digest("hex");
  if (sha2 !== sha) throw new Error("second write differs: program is not deterministic");
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(back)) throw new Error("entry holds control characters");
  console.log(`entry.txt: ${chars} chars, ${bytes} bytes, sha256 ${sha}`);
}

main();
