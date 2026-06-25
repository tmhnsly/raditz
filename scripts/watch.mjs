// Rebuild the package (dist/) whenever src changes, so a LINKED consumer always sees
// fresh Raditz during co-development. Dependency-free (Node fs.watch). Runs the full
// `build:pkg` (incl. the @layer wrap), debounced, with no overlapping builds. New
// components still need a manual `pnpm gen:barrel` (the barrel isn't regenerated here,
// to avoid a watch loop). Cross-platform: recursive fs.watch (macOS/Windows, and Node
// 20+ on Linux) with a per-directory fallback for older Node on Linux.
import { watch, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

let timer;
let building = false;
let queued = false;

function build() {
  if (building) { queued = true; return; }
  building = true;
  const started = Date.now();
  const p = spawn('pnpm', ['build:pkg'], { stdio: 'inherit', shell: true });
  p.on('exit', (code) => {
    building = false;
    if (code === 0) console.log(`▲ raditz: dist rebuilt in ${Date.now() - started}ms`);
    if (queued) { queued = false; build(); }
  });
}

function onChange(file) {
  if (!file) return;
  const name = String(file);
  if (name.endsWith('index.ts')) return;                 // skip the generated barrel
  if (!/\.(ts|tsx|scss|css)$/.test(name)) return;
  clearTimeout(timer);
  timer = setTimeout(build, 200);                         // debounce a burst of saves
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
build();                                                  // initial build so dist is fresh
