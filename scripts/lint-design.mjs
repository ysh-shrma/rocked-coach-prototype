#!/usr/bin/env node
/**
 * Design-system lint for the /v3 lane.
 *
 * A token system with no enforcement decays within a day, and this repo has more
 * than one agent working in it. This turns "grep for ad hoc values" from a manual
 * step into a build gate.
 *
 * Scope is v3 only, on purpose. `/` and `/v2` are frozen — they are full of
 * arbitrary values by definition, and reporting them would bury the signal.
 *
 * Usage:  node scripts/lint-design.mjs [--report]
 *   default   exit 1 if any violation is found
 *   --report  print counts and always exit 0 (for tracking progress mid-sweep)
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const TARGETS = ["src/components/v3", "src/app/v3"];
const REPORT_ONLY = process.argv.includes("--report");

/** Arbitrary-value patterns that the token system is meant to replace. */
const RULES = [
  {
    id: "type",
    re: /\btext-\[[0-9.]+px\]/g,
    msg: "ad hoc font size — use a v3 type style (text-large-title … text-caption)",
  },
  {
    id: "spacing",
    re: /\b(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-\[[0-9.]+px\]/g,
    msg: "off-grid spacing — use Tailwind's 4pt scale (p-1 … p-12)",
  },
  {
    id: "radius",
    re: /\brounded-\[[0-9.]+px\]/g,
    msg: "ad hoc radius — use rounded-sm / rounded-md / rounded-lg / rounded-xl",
  },
  {
    id: "shadow",
    re: /\bshadow-\[[^\]]+\]|boxShadow:/g,
    msg: "ad hoc shadow — use shadow-e1 / shadow-e2 / shadow-e3",
  },
  {
    id: "v2-token",
    // The six v2-only type tokens. v3 must not read them; they disappear when v2
    // retires, and mixing the two scales is how a system quietly forks.
    re: /\btext-(display-xl|display|title|body|meta|micro)\b/g,
    msg: "v2-only type token — v3 uses the HIG scale instead",
  },
  {
    id: "icon-size",
    // Icons are pinned to 16 or 20 via the Icon wrapper. Larger decorative art
    // (avatars, plates) is exempt via the allow-comment below.
    re: /size=\{(?!16\}|20\})[0-9]+\}/g,
    msg: "off-system icon size — use 16 or 20, or mark the line design-lint-ok",
  },
];

const files = [];
const walk = (dir) => {
  let entries;
  try { entries = readdirSync(join(ROOT, dir)); } catch { return; }
  for (const e of entries) {
    const rel = join(dir, e);
    if (statSync(join(ROOT, rel)).isDirectory()) walk(rel);
    else if (/\.(tsx|ts)$/.test(e)) files.push(rel);
  }
};
TARGETS.forEach(walk);

const counts = Object.fromEntries(RULES.map((r) => [r.id, 0]));
const findings = [];

for (const file of files) {
  const lines = readFileSync(join(ROOT, file), "utf8").split("\n");
  lines.forEach((line, i) => {
    // Escape hatch for the rare genuinely-bespoke value. Must be justified in
    // the same comment, so it stays visible in review rather than becoming a
    // silent bypass.
    if (line.includes("design-lint-ok")) return;
    for (const rule of RULES) {
      const hits = line.match(rule.re);
      if (!hits) continue;
      counts[rule.id] += hits.length;
      findings.push({ file, line: i + 1, rule: rule.id, msg: rule.msg, snippet: hits.join(" ") });
    }
  });
}

const total = Object.values(counts).reduce((a, b) => a + b, 0);

console.log(`design lint — ${files.length} v3 files scanned\n`);
for (const rule of RULES) {
  const n = counts[rule.id];
  console.log(`  ${n === 0 ? "✓" : "✗"} ${rule.id.padEnd(10)} ${String(n).padStart(4)}  ${rule.msg}`);
}

if (findings.length && !REPORT_ONLY) {
  console.log("\nfirst 25 violations:");
  for (const f of findings.slice(0, 25)) {
    console.log(`  ${relative(".", f.file)}:${f.line}  [${f.rule}]  ${f.snippet}`);
  }
  if (findings.length > 25) console.log(`  … and ${findings.length - 25} more`);
}

console.log(`\ntotal: ${total}`);
if (total > 0 && !REPORT_ONLY) process.exit(1);
