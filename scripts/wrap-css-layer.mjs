#!/usr/bin/env node
// Wrap the published stylesheet in `@layer raditz { … }`.
//
// Why: a consumer's brand overrides (theme.css: `:root { --accent-9: … }`) must
// win over the library's defaults regardless of bundler import order. Cascade
// layers make that deterministic — any UNLAYERED consumer rule beats every rule
// in the `raditz` layer — so products no longer need a `:root:root` specificity
// trick or a guaranteed import order.
//
// @charset must stay the very first token, so it's hoisted out of the layer.
import { readFileSync, writeFileSync } from 'node:fs';

const PATH = 'dist/raditz.css';
const css = readFileSync(PATH, 'utf8');

if (css.includes('@layer raditz')) {
  console.log('wrap-css-layer: already layered — skipping');
  process.exit(0);
}

const charset = (css.match(/^@charset[^;]*;/) || [''])[0];
const body = css.slice(charset.length);

// @import (if any were ever added) must precede other rules and can't sit inside
// a layer block like this — fail loudly rather than emit invalid CSS.
if (/@import\b/.test(body)) {
  console.error('wrap-css-layer: unexpected @import in raditz.css — aborting');
  process.exit(1);
}

writeFileSync(PATH, `${charset}\n@layer raditz {\n${body}\n}\n`);
console.log('wrap-css-layer: wrapped dist/raditz.css in @layer raditz');
