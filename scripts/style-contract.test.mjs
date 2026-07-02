// Style-contract gates — source-scanning tests that keep three conventions honest:
//
//  a) No inline REAL-property styles in shipped tsx (src/components, src/sections,
//     src/lib). Dynamic values cross the JS/CSS boundary as custom properties
//     (`--rdz-*`) consumed by the component's stylesheet; the stylesheet owns the
//     real properties. Stories/tests are exempt (workbench code).
//  b) z-index values come from the --z-* ladder (tokens/layout.css), or are the
//     raw LOCAL rungs 0/1/2 inside a component's own stacking/isolation context.
//  c) README's stated component/section counts match the actual source surface
//     (sourceSurface()), so the README can't silently rot again.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { sourceSurface } from './public-surface.mjs';

function walk(dir, exts, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, exts, out);
    else if (exts.some((e) => p.endsWith(e))) out.push(p);
  }
  return out;
}

const posix = (p) => p.split(path.sep).join('/');

/* ── a) inline styles: only custom properties may cross the JS/CSS boundary ── */

// Sanctioned real-property inline styles, per exact file. SVG paint attributes that
// reference a per-instance local id (`url(#…)`) cannot be expressed in static CSS.
const INLINE_STYLE_ALLOWLIST = {
  'src/components/data/LineChart/LineChart.tsx': ['fill'], // fill: url(#<uid>-area) — local gradient id
};

/** Extract the balanced `{…}` object text starting at src[start] === '{'. */
function balancedObject(src, start) {
  let depth = 0;
  let inStr = null;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === '\\') i++;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') inStr = c;
    else if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return src.slice(start + 1, i);
    }
  }
  return null;
}

/** Top-level keys of an object-literal body; recurses into object literals found
 *  inside spread entries (`...(cond ? { … } : null)`). Spread of an identifier
 *  (`...style`, `...rest`) is fine — that forwards the consumer's style prop. */
function objectKeys(body) {
  const keys = [];
  const entries = [];
  let depth = 0;
  let inStr = null;
  let last = 0;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (inStr) {
      if (c === '\\') i++;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') inStr = c;
    else if ('{(['.includes(c)) depth++;
    else if ('})]'.includes(c)) depth--;
    else if (c === ',' && depth === 0) {
      entries.push(body.slice(last, i));
      last = i + 1;
    }
  }
  entries.push(body.slice(last));
  for (const raw of entries) {
    const entry = raw.trim();
    if (!entry) continue;
    if (entry.startsWith('...')) {
      // recurse into any object literal inside the spread expression
      const brace = entry.indexOf('{');
      if (brace !== -1) {
        const inner = balancedObject(entry, brace);
        if (inner != null) keys.push(...objectKeys(inner));
      }
      continue;
    }
    // key is the text before the first top-level colon
    let d = 0;
    let s = null;
    for (let i = 0; i < entry.length; i++) {
      const c = entry[i];
      if (s) {
        if (c === '\\') i++;
        else if (c === s) s = null;
        continue;
      }
      if (c === "'" || c === '"' || c === '`') s = c;
      else if ('{(['.includes(c)) d++;
      else if ('})]'.includes(c)) d--;
      else if (c === ':' && d === 0) {
        keys.push(entry.slice(0, i).trim().replace(/^['"]|['"]$/g, ''));
        break;
      }
    }
  }
  return keys;
}

describe('inline styles (shipped tsx): custom properties only', () => {
  const roots = ['src/components', 'src/sections', 'src/lib'];
  const files = roots
    .flatMap((r) => walk(r, ['.tsx']))
    .filter((f) => !f.endsWith('.stories.tsx') && !f.endsWith('.test.tsx'));

  it('scans a plausible surface', () => {
    expect(files.length).toBeGreaterThan(100);
  });

  it('every style={{…}} object sets only --* custom properties (allowlist: sanctioned SVG url(#id) paints)', () => {
    const violations = [];
    for (const file of files) {
      const rel = posix(file);
      const src = fs.readFileSync(file, 'utf8');
      const allowed = INLINE_STYLE_ALLOWLIST[rel] ?? [];
      let idx = 0;
      while ((idx = src.indexOf('style={{', idx)) !== -1) {
        const body = balancedObject(src, idx + 'style={'.length);
        idx += 'style={{'.length;
        if (body == null) continue;
        for (const key of objectKeys(body)) {
          if (key.startsWith('--')) continue;
          if (allowed.includes(key)) continue;
          const line = src.slice(0, idx).split('\n').length;
          violations.push(`${rel}:${line} sets real property "${key}" inline`);
        }
      }
    }
    expect(violations, violations.join('\n')).toEqual([]);
  });

  it('allowlist entries still exist (no stale exemptions)', () => {
    for (const [file, keys] of Object.entries(INLINE_STYLE_ALLOWLIST)) {
      expect(fs.existsSync(file), file).toBe(true);
      const src = fs.readFileSync(file, 'utf8');
      for (const key of keys) expect(src, `${file} no longer inlines "${key}"`).toContain(`${key}:`);
    }
  });
});

/* ── b) z-index: ladder rungs or local 0/1/2 only ── */

// Allowlisted z-index values, per exact file. AvatarGroup stacks its slots by a
// data-driven index (right-on-top cascade; the "+N" slot on top) — a local ordinal,
// not a ladder rung.
const Z_INDEX_ALLOWLIST = {
  'src/components/surfaces/AvatarGroup/AvatarGroup.scss': ['var(--rdz-avatar-z, 0)'],
};

describe('z-index: var(--z-*) rungs or local 0/1/2', () => {
  // Shipped styles: everything the CSS build bundles (src/styles/bundle.ts →
  // components + pages scss glob, sections css glob, tokens). src/explorer is the
  // showroom app, not shipped — out of scope.
  const files = [
    ...walk('src/components', ['.scss', '.css']),
    ...walk('src/sections', ['.scss', '.css']),
    ...walk('src/pages', ['.scss', '.css']),
    ...walk('src/styles', ['.scss', '.css']),
  ];

  it('finds shipped stylesheets', () => {
    expect(files.length).toBeGreaterThan(80);
  });

  it('every z-index is a ladder rung or a local 0/1/2', () => {
    const violations = [];
    for (const file of files) {
      const rel = posix(file);
      const src = fs.readFileSync(file, 'utf8');
      const allowed = Z_INDEX_ALLOWLIST[rel] ?? [];
      for (const m of src.matchAll(/z-index\s*:\s*([^;}]+)/g)) {
        const value = m[1].trim();
        if (/^var\(--z-[\w-]+\)$/.test(value)) continue;
        if (/^[012]$/.test(value)) continue;
        if (value === 'auto') continue;
        if (allowed.includes(value)) continue;
        const line = src.slice(0, m.index).split('\n').length;
        violations.push(`${rel}:${line} z-index: ${value}`);
      }
    }
    expect(violations, violations.join('\n')).toEqual([]);
  });
});

/* ── c) README counts match the source surface ── */

describe('README counts match sourceSurface()', () => {
  const readme = fs.readFileSync('README.md', 'utf8');
  const surface = sourceSurface();

  it('component + category counts', () => {
    const m = readme.match(/(\d+) real React components across (\d+) categories/);
    expect(m, 'README lost its "<N> real React components across <M> categories" line').toBeTruthy();
    expect(Number(m[1])).toBe(surface.components.length);
    expect(Number(m[2])).toBe(new Set(surface.components.map((c) => c.category)).size);
  });

  it('section count', () => {
    const m = readme.match(/(\d+) composable page sections/);
    expect(m, 'README lost its "<N> composable page sections" line').toBeTruthy();
    expect(Number(m[1])).toBe(surface.sections.length);
  });
});

/* ── d) enumerated variant axes ride data attributes, not class templates ── */

// One-of-N axes (variant/size/tone/side/…) are wired as data attributes
// (`data-variant={variant}` styled as `.rdz-x[data-variant='primary']`) — an
// attribute holds exactly one value, so conflicting modifiers are
// unrepresentable. A template-literal class modifier (`rdz-x--${axis}`) is an
// enumerated axis by construction, so its presence in shipped tsx means the
// convention regressed. Boolean modifiers (`cond && 'is-x'`) stay classes and
// are untouched by this rule.
describe('no template-literal class modifiers (enumerated axes use data attributes)', () => {
  const roots = ['src/components', 'src/sections', 'src/lib'];
  const files = roots
    .flatMap((r) => walk(r, ['.tsx', '.ts']))
    .filter((f) => !/\.(stories|test)\.tsx?$/.test(f));

  it('shipped tsx builds no `…--${…}` class strings', () => {
    const violations = [];
    for (const file of files) {
      const rel = posix(file);
      const src = fs.readFileSync(file, 'utf8');
      for (const [i, line] of src.split('\n').entries()) {
        // `x--${` inside a template literal: a word char must precede the `--`
        // (class modifiers look like `rdz-btn--${v}`), which excludes CSS
        // custom-property NAMES (`--${name}`) and values (`var(--${a}-9)`).
        if (/`[^`]*\w--\$\{/.test(line)) {
          violations.push(`${rel}:${i + 1} builds an enum class modifier: ${line.trim()}`);
        }
      }
    }
    expect(violations, violations.join('\n')).toEqual([]);
  });
});
