#!/usr/bin/env node
/**
 * Stamp every local CSS/JS reference in the HTML pages with a hash of the file's content:
 *   <link href="styles.css?v=3f9a1c2b7e">
 *
 * Why: vercel.json caches .css/.js for a year ("immutable"). The ?v= value is the only
 * thing that makes browsers fetch a new copy, so it must change whenever the file does.
 * Hashing the content does that automatically — no more hand-edited version strings.
 *
 * Usage:
 *   node tools/stamp-versions.mjs          # rewrite the ?v= values
 *   node tools/stamp-versions.mjs --check  # exit 1 if any value is stale (run by the pre-push hook)
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const SKIP_DIRS = new Set(['node_modules', 'scripts', 'tools', 'tests', 'docs']);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const hashOf = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 10);

// Matches src="…/name.js?v=…" and href="…/name.css?v=…"
const REF = /((?:src|href)=["'])([^"'?#]+\.(?:css|js))\?v=([^"'&#]*)/g;

let stale = 0;
let missing = 0;
for (const page of walk(ROOT)) {
  const html = fs.readFileSync(page, 'utf8');
  const next = html.replace(REF, (match, attr, ref, oldVersion) => {
    if (/^(https?:)?\/\//.test(ref)) return match;
    const target = ref.startsWith('/')
      ? path.resolve(ROOT, `.${ref}`)
      : path.resolve(path.dirname(page), ref);
    if (!fs.existsSync(target)) {
      console.error(`[stamp-versions] missing file: ${path.relative(ROOT, page)} -> ${ref}`);
      missing += 1;
      return match;
    }
    const version = hashOf(target);
    if (version !== oldVersion) stale += 1;
    return `${attr}${ref}?v=${version}`;
  });
  if (next !== html && !CHECK) fs.writeFileSync(page, next);
}

if (missing) process.exit(1);
if (CHECK && stale) {
  console.error(`[stamp-versions] ${stale} stale ?v= value(s). Run: node tools/stamp-versions.mjs`);
  process.exit(1);
}
console.log(CHECK ? '[stamp-versions] all ?v= values are current' : `[stamp-versions] updated ${stale} reference(s)`);
