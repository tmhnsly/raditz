// Prepends 'use client'; to shipped sources that use client-only React features,
// so the built package works under React Server Components (Next App Router).
// Vite + vitest treat the directive as an inert string. Idempotent.
//
// The file set is the shared shipped surface (scripts/public-surface.mjs):
// src/components + src/sections + src/lib, minus stories/tests/d.ts — the same
// seam check-consumer.mjs verifies in dist. No hand EXTRA list: lib files that
// carry 'use client' (ColorSchemeToggle, InView, ThemePicker, useColorScheme,
// theme) are covered because the whole lib dir is walked.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { shippedSourceFiles } from './public-surface.mjs';

// Shipped files that trip CLIENT_RE but are server-safe BY DESIGN — the codemod
// must never mark them, and the boundary gate (add-use-client.test.mjs) accepts
// them without a directive. Each entry carries its reason; the gate also fails
// if an entry stops existing or stops matching CLIENT_RE (staleness guard).
export const SERVER_SAFE = {
  // Header contract: "Server-safe core of the Color-scheme module (NO 'use client')".
  // It exports the pre-paint no-flash script as a STRING for an SSR <head> plus a
  // guarded client-render init — localStorage/window/document appear only inside
  // that string builder and a try/typeof-guarded function. Marking it client would
  // pull the no-flash core out of Server Components, defeating its purpose.
  'src/lib/colorScheme.ts':
    'server-safe by design (file header): SSR no-flash script builder + guarded init',
  // Its only CLIENT_RE hit is `onClick={action.onClick}` in SectionActionButton —
  // forwarding a CONSUMER-supplied handler, exactly like the unmarked Button it
  // renders. No hooks/handlers of its own; its client-ness lives in the imported
  // InView boundary. Sections must stay server-renderable (SectionAction docs:
  // "Prefer href (Server-Component-safe) over onClick").
  'src/lib/SectionShell.tsx':
    'onClick hit is consumer-handler forwarding (SectionActionButton); shell itself is a Server Component',
};

// A module must run on the client if it uses hooks, JSX event handlers, or browser globals.
// This is a heuristic, not a parser: it can over-mark (e.g. a local var named `document`)
// — which is the safe direction (a needless client boundary, never a broken server one) —
// and `stripComments` only crudely ignores comment prose, not `//` inside string literals.
export const CLIENT_RE =
  /\b(useState|useEffect|useLayoutEffect|useReducer|useRef|useContext|useId|useImperativeHandle|useSyncExternalStore|useTransition|useDeferredValue|useMemo|useCallback|useInsertionEffect)\b|\bon[A-Z][A-Za-z]*=|\b(document|window|localStorage|sessionStorage|navigator|matchMedia|requestAnimationFrame|IntersectionObserver|ResizeObserver)\b/;

const DIRECTIVE = "'use client';";

export function alreadyDirective(src) {
  const firstCode = src.replace(/^﻿/, '').trimStart();
  return /^['"]use client['"];?/.test(firstCode);
}

// Strip comments before signal detection so prose like "...document flow" in a
// JSDoc doesn't force a static component to a client boundary. (Detection only —
// the file itself is never rewritten from this stripped copy.)
export function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

// The whole decision, pure: does this source need the directive prepended?
export function needsDirective(src) {
  return CLIENT_RE.test(stripComments(src)) && !alreadyDirective(src);
}

function main() {
  // .ts and .tsx both: hook-bearing internals (e.g. primitiveUtils.ts exporting
  // useControllableState) are plain .ts but get re-exported through the barrel,
  // so a consumer's Server Component pulls them into the RSC graph. The CLIENT_RE
  // gate leaves pure-util .ts (format.ts, scale.ts) as server components.
  const files = shippedSourceFiles().filter((f) => !(f in SERVER_SAFE));
  let added = 0;
  const changed = [];
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    if (!needsDirective(src)) continue; // static or already marked
    fs.writeFileSync(file, `${DIRECTIVE}\n${src}`);
    added++;
    changed.push(file);
  }
  console.log(`add-use-client: marked ${added} file(s) as client (of ${files.length} scanned).`);
  for (const c of changed.sort()) console.log(`  + ${c}`);
}

// Only run the codemod when executed as a script — importing the exported
// heuristics (tests, preflight) must never rewrite sources.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
