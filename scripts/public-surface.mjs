// Shared public-surface module.
// LIB: curated lib allowlist shared by gen-barrel and gen-catalog.
// sourceSurface(): walks src/components and src/sections, returning every public
// entry (has a *.stories.tsx, internal excluded) with resolved file paths.
import fs from 'node:fs';
import path from 'node:path';

export const LIB = [
  './lib/colorScheme',
  './lib/useColorScheme',
  './lib/ColorSchemeToggle',
  './lib/ThemePicker',
  './lib/theme',
  './lib/hooks',
  './lib/Frame',
  './lib/SectionShell',
  './lib/InView',
  './lib/HeroBleed',
];

function hasStory(dir) {
  return fs.readdirSync(dir).some((f) => f.endsWith('.stories.tsx'));
}

function resolveComponentFile(dir, name) {
  const preferred = path.join(dir, `${name}.tsx`);
  if (fs.existsSync(preferred)) return preferred;
  const tsx = fs.readdirSync(dir).find(
    (f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx') && !f.endsWith('.test.tsx'),
  );
  return tsx ? path.join(dir, tsx) : preferred;
}

function entry(category, name, dir) {
  return {
    category,
    name,
    dir,
    componentFile: resolveComponentFile(dir, name),
    storyFile: path.join(dir, `${name}.stories.tsx`),
    testFile: path.join(dir, `${name}.test.tsx`),
  };
}

export function sourceSurface() {
  const components = [];
  const compRoot = 'src/components';
  for (const cat of fs.readdirSync(compRoot).sort()) {
    const catDir = path.join(compRoot, cat);
    if (cat === 'internal' || !fs.statSync(catDir).isDirectory()) continue;
    for (const name of fs.readdirSync(catDir).sort()) {
      const dir = path.join(catDir, name);
      if (fs.statSync(dir).isDirectory() && hasStory(dir)) {
        components.push(entry(cat, name, dir));
      }
    }
  }
  const sections = [];
  const secRoot = 'src/sections';
  for (const name of fs.readdirSync(secRoot).sort()) {
    const dir = path.join(secRoot, name);
    if (fs.statSync(dir).isDirectory() && hasStory(dir)) {
      sections.push(entry(null, name, dir));
    }
  }
  return { components, sections };
}
