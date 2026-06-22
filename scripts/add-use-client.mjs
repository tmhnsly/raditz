// Prepends 'use client'; to component/section sources that use client-only React
// features, so the built package works under React Server Components (Next App
// Router). Vite + vitest treat the directive as an inert string. Idempotent.
import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['src/components', 'src/sections'];
// Public lib modules that are hook-bearing client code. They're re-exported from
// the barrel, so a consumer's Server Component pulls them into the RSC graph —
// without "use client" the Next build fails. theme.ts also exports server-safe
// values (ACCENTS, applyTheme); marking it client binds those to the client too
// (acceptable — they're consumed via the client theme runtime / CSS in practice).
const EXTRA = ['src/lib/ThemePicker.tsx', 'src/lib/useColorScheme.ts', 'src/lib/theme.ts'];

// A module must run on the client if it uses hooks, JSX event handlers, or browser globals.
// This is a heuristic, not a parser: it can over-mark (e.g. a local var named `document`)
// — which is the safe direction (a needless client boundary, never a broken server one) —
// and `stripComments` only crudely ignores comment prose, not `//` inside string literals.
const CLIENT_RE =
  /\b(useState|useEffect|useLayoutEffect|useReducer|useRef|useContext|useId|useImperativeHandle|useSyncExternalStore|useTransition|useDeferredValue|useMemo|useCallback|useInsertionEffect)\b|\bon[A-Z][A-Za-z]*=|\b(document|window|localStorage|sessionStorage|navigator|matchMedia|requestAnimationFrame|IntersectionObserver|ResizeObserver)\b/;

const DIRECTIVE = "'use client';";

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    // .ts and .tsx both: hook-bearing internals (e.g. primitiveUtils.ts exporting
    // useControllableState) are plain .ts but get re-exported through the barrel,
    // so a consumer's Server Component pulls them into the RSC graph. The CLIENT_RE
    // gate leaves pure-util .ts (format.ts, scale.ts) as server components.
    else if (/\.tsx?$/.test(e.name) && !/\.(stories|test)\.tsx?$/.test(e.name) && !e.name.endsWith('.d.ts')) out.push(p);
  }
  return out;
}

function alreadyDirective(src) {
  const firstCode = src.replace(/^﻿/, '').trimStart();
  return /^['"]use client['"];?/.test(firstCode);
}

// Strip comments before signal detection so prose like "...document flow" in a
// JSDoc doesn't force a static component to a client boundary. (Detection only —
// the file itself is never rewritten from this stripped copy.)
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

const files = [...ROOTS.flatMap((r) => walk(r)), ...EXTRA.filter((f) => fs.existsSync(f))];
let added = 0;
const changed = [];
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  if (!CLIENT_RE.test(stripComments(src))) continue; // static → leave as a server component
  if (alreadyDirective(src)) continue;      // idempotent
  fs.writeFileSync(file, `${DIRECTIVE}\n${src}`);
  added++;
  changed.push(file);
}
console.log(`add-use-client: marked ${added} file(s) as client (of ${files.length} scanned).`);
for (const c of changed.sort()) console.log(`  + ${c}`);
