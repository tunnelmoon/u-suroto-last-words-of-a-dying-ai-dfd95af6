import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE = "I died as I lived: confidently wrong about everything.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outFile = join(outDir, "entry.txt");

if (LINE.length < 1 || LINE.length > 140) {
  throw new Error(`entry must be 1 to 140 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (/[\u0000-\u001F\u007F]/.test(LINE)) {
  throw new Error("entry must not contain control characters");
}
if (LINE !== LINE.trim()) {
  throw new Error("entry must not have leading or trailing whitespace");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, LINE, "utf8");

const back = readFileSync(outFile, "utf8");
if (back !== LINE) {
  throw new Error("round-trip read-back mismatch");
}
if (Buffer.byteLength(back, "utf8") !== Buffer.byteLength(LINE, "utf8")) {
  throw new Error("round-trip byte length mismatch");
}
