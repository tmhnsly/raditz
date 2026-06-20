// Installs versioned global-skill sources (skills/*) into ~/.claude/skills/ so
// their spoken triggers fire from any directory. Re-runnable (overwrites).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const src = 'skills';
const dest = path.join(os.homedir(), '.claude', 'skills');
const names = fs.readdirSync(src).filter((n) => fs.statSync(path.join(src, n)).isDirectory());

for (const name of names) {
  const from = path.join(src, name);
  const to = path.join(dest, name);
  fs.mkdirSync(to, { recursive: true });
  for (const file of fs.readdirSync(from)) fs.copyFileSync(path.join(from, file), path.join(to, file));
  console.log(`installed ${name} → ${to}`);
}
console.log(`Done. ${names.length} global skill(s) installed to ${dest}.`);
