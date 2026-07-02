// Pins the 'use client' heuristic (scripts/add-use-client.mjs). This is the sole
// gatekeeper of the package's RSC boundary, so its edge cases are asserted here —
// including the KNOWN limitations, pinned as current behaviour so a change to the
// heuristic is a deliberate, visible decision rather than an accident.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { CLIENT_RE, stripComments, alreadyDirective, needsDirective, SERVER_SAFE } from './add-use-client.mjs';
import { shippedSourceFiles } from './public-surface.mjs';

describe('needsDirective', () => {
  it('marks hook usage', () => {
    expect(needsDirective(`import { useState } from 'react';\nexport function C() { const [a] = useState(0); return a; }`)).toBe(true);
  });

  it('marks JSX event handlers', () => {
    expect(needsDirective(`export const C = () => <button onClick={() => {}}>x</button>;`)).toBe(true);
  });

  it('marks browser globals', () => {
    expect(needsDirective(`export const w = () => window.innerWidth;`)).toBe(true);
    expect(needsDirective(`export const m = () => matchMedia('(min-width: 40rem)');`)).toBe(true);
  });

  it('leaves static components alone', () => {
    expect(needsDirective(`export function Badge({ children }) { return <span className="rdz-badge">{children}</span>; }`)).toBe(false);
  });

  it('ignores client tokens in line comments', () => {
    expect(needsDirective(`// positions against document flow, then window-relative\nexport const x = 1;`)).toBe(false);
  });

  it('ignores client tokens in block/JSDoc comments', () => {
    expect(needsDirective(`/** Reads localStorage on the client via useColorScheme — see useState docs. */\nexport const x = 1;`)).toBe(false);
  });

  it('is idempotent: an already-marked client file is not re-marked', () => {
    expect(needsDirective(`'use client';\nimport { useState } from 'react';\nexport const C = () => useState(0);`)).toBe(false);
  });

  it('KNOWN LIMITATION (pinned): tokens inside string literals over-mark', () => {
    // stripComments doesn't parse strings, so a string mentioning `document`
    // forces a client boundary. Over-marking is the safe direction (a needless
    // client boundary, never a broken server one) — pinned, not endorsed.
    expect(needsDirective(`export const msg = 'check the document for details';`)).toBe(true);
  });
});

describe('stripComments', () => {
  it('strips line and block comments', () => {
    expect(stripComments('a; // window here\n/* document there */b;')).toBe('a; \nb;');
  });

  it('preserves protocol URLs (the `://` guard)', () => {
    expect(stripComments(`const u = 'https://example.com/window';`)).toContain('https://example.com/window');
  });
});

describe('alreadyDirective', () => {
  it('accepts single/double quotes, with/without semicolon, leading whitespace and BOM', () => {
    for (const head of [`'use client';`, `"use client"`, `\n  'use client'`, `﻿'use client';`]) {
      expect(alreadyDirective(`${head}\nexport {};`), JSON.stringify(head)).toBe(true);
    }
  });

  it('rejects a directive that is not the first statement', () => {
    expect(alreadyDirective(`import x from 'y';\n'use client';`)).toBe(false);
  });
});

describe('client-boundary gate over the shipped surface', () => {
  // The missing-directive class nothing could catch before: a shipped file with
  // client signals but no 'use client' and no SERVER_SAFE entry. (The preflight
  // codemod run only catches files it WALKS — this asserts the walk itself,
  // over the same shippedSourceFiles() seam, leaves no client file unmarked.)
  it('every client-signal file carries the directive or is on SERVER_SAFE', () => {
    const missing = shippedSourceFiles().filter((f) => {
      if (f in SERVER_SAFE) return false;
      const src = fs.readFileSync(f, 'utf8');
      return CLIENT_RE.test(stripComments(src)) && !alreadyDirective(src);
    });
    expect(missing, `missing 'use client' (or a SERVER_SAFE entry): ${missing.join(', ')}`).toEqual([]);
  });

  // Staleness guard (style-contract pattern): a SERVER_SAFE entry must still
  // exist, still trip CLIENT_RE (else the exemption is dead weight), and must
  // not have grown a directive (else the exemption contradicts the source).
  it('SERVER_SAFE entries are alive, reasoned, and still exempt something real', () => {
    expect(Object.keys(SERVER_SAFE).length).toBeGreaterThan(0);
    for (const [file, reason] of Object.entries(SERVER_SAFE)) {
      expect(typeof reason === 'string' && reason.length > 10, `${file}: needs a real reason`).toBe(true);
      expect(fs.existsSync(file), `${file} no longer exists — drop it from SERVER_SAFE`).toBe(true);
      const src = fs.readFileSync(file, 'utf8');
      expect(CLIENT_RE.test(stripComments(src)), `${file} no longer matches CLIENT_RE — drop it from SERVER_SAFE`).toBe(true);
      expect(alreadyDirective(src), `${file} carries 'use client' yet sits on SERVER_SAFE — resolve the contradiction`).toBe(false);
    }
  });
});

describe('CLIENT_RE', () => {
  it('does not fire on hook-like names that are not hooks', () => {
    expect(CLIENT_RE.test('const useStateful = 1; houseState();')).toBe(false);
  });

  it('does not fire on lowercase jsx props', () => {
    expect(CLIENT_RE.test('<a href="x" onclick="legacy">')).toBe(false);
  });
});
