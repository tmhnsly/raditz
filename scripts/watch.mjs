// Rebuild the package (dist/) whenever src changes, so a LINKED consumer always sees
// fresh Raditz during co-development. Dependency-free (Node fs.watch). Routes by change
// type so a save never runs the whole pipeline: a code edit rebuilds only the JS bundle
// (`build:lib`), a style edit only the CSS (`build:css` + the @layer wrap). The initial
// build is full. New components still need a manual `pnpm gen:barrel` (the barrel isn't
// regenerated here, to avoid a watch loop). Cross-platform: recursive fs.watch
// (macOS/Windows, and Node 20+ on Linux) with a per-directory fallback for older Node.
import { watch, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

let timer;
let building = false;
let queued = false;
let libDirty = false; // a .ts/.tsx changed → rebuild the JS bundle
let cssDirty = false; // a .scss/.css changed → rebuild the stylesheet

const sh = (cmd) => new Promise((resolve) => spawn(cmd, { stdio: 'inherit', shell: true }).on('exit', resolve));

async function flush() {
  if (building) { queued = true; return; }
  building = true;
  const lib = libDirty;
  const css = cssDirty;
  libDirty = false;
  cssDirty = false;
  const started = Date.now();
  let code = 0;
  if (lib) code = await sh('pnpm build:lib');
  if (code === 0 && css) code = await sh('pnpm build:css && node scripts/wrap-css-layer.mjs');
  building = false;
  const what = [lib && 'lib', css && 'css'].filter(Boolean).join('+') || 'nothing';
  if (code === 0) {
    console.log(`▲ raditz: ${what} rebuilt in ${Date.now() - started}ms`);
  } else {
    // A step failed — re-arm the work requested this round so the next save retries it,
    // instead of silently dropping (e.g. a CSS edit skipped because the lib step failed).
    if (lib) libDirty = true;
    if (css) cssDirty = true;
    console.error(`▲ raditz: ${what} rebuild FAILED (exit ${code}) — see the error above; dist NOT fully updated`);
  }
  if (queued) { queued = false; flush(); }
}

function onChange(file) {
  if (!file) return;
  const name = String(file);
  if (name.endsWith('index.ts')) return;                 // skip the generated barrel
  if (/\.(scss|css)$/.test(name)) cssDirty = true;
  else if (/\.(ts|tsx)$/.test(name)) libDirty = true;
  else return;
  clearTimeout(timer);
  timer = setTimeout(flush, 200);                         // debounce a burst of saves
}

function watchTree(dir) {
  try {
    // Recursive: one watcher for the whole tree (macOS / Windows / Node 20+ Linux).
    watch(dir, { recursive: true }, (_event, file) => onChange(file));
  } catch {
    // Fallback (older Node on Linux): watch each existing directory individually.
    const walk = (d) => {
      watch(d, (_event, file) => onChange(file));
      for (const entry of readdirSync(d, { withFileTypes: true })) {
        if (entry.isDirectory()) walk(join(d, entry.name));
      }
    };
    walk(dir);
    console.log('▲ raditz watch: per-directory mode (recursive fs.watch unavailable)');
  }
}

console.log('▲ raditz watch — rebuilding dist/ on src changes (Ctrl+C to stop)');
watchTree('src');
libDirty = true; // initial build is full (lib + css) so dist is complete
cssDirty = true;
flush();
