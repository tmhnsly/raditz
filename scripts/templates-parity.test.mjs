// Parity gate for the starter templates. /raditz-new copies a template wholesale,
// so per-template copies of shared files must EXIST — this suite pins them equal
// instead of deduplicating, and pins the fragile literals the skills string-match.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

// The ONE canonical pin placeholder (true origin slug + REPLACE_WITH_TAG marker).
// raditz-new find-and-replaces this exact literal in a fresh scaffold's package.json.
const PIN_PLACEHOLDER = 'github:tmhnsly/raditz#REPLACE_WITH_TAG';

describe('templates parity', () => {
  it.each(['rdz-link.mjs', 'rdz-prebuild.mjs'])(
    '%s is byte-identical across templates (hand-synced copies)',
    (script) => {
      const next = fs.readFileSync(path.join(ROOT, `templates/next/scripts/${script}`));
      const vite = fs.readFileSync(path.join(ROOT, `templates/vite/scripts/${script}`));
      expect(next.equals(vite)).toBe(true);
    },
  );

  it('both templates gate the library prebuild on the link override (never rebuild a sibling checkout when tag-pinned)', () => {
    for (const t of ['next', 'vite']) {
      expect(JSON.parse(read(`templates/${t}/package.json`)).scripts.prebuild).toBe(
        'node scripts/rdz-prebuild.mjs',
      );
    }
  });

  it('both templates wire a colour-scheme pre-paint (no light→dark flash)', () => {
    // Next: SSR face — the no-flash <head> script.
    expect(read('templates/next/app/layout.tsx')).toContain('colorSchemeScript');
    // Vite: runtime face — init before the first client render.
    expect(read('templates/vite/src/main.tsx')).toContain('initColorScheme');
  });

  it('both templates pin raditz with the same canonical placeholder', () => {
    const pins = ['next', 'vite'].map(
      (t) => JSON.parse(read(`templates/${t}/package.json`)).dependencies.raditz,
    );
    expect(pins[0]).toBe(PIN_PLACEHOLDER);
    expect(pins[1]).toBe(PIN_PLACEHOLDER);
  });

  it('the placeholder matches the literal raditz-new find-and-replaces', () => {
    const skill = read('skills/raditz-new/SKILL.md');
    const quoted = skill.match(/github:[\w.-]+\/[\w.-]+#REPLACE_WITH_TAG/g) ?? [];
    expect(quoted.length).toBeGreaterThan(0);
    for (const literal of quoted) expect(literal).toBe(PIN_PLACEHOLDER);
  });

  it('the release skill quotes the true slug in its consumer pin line', () => {
    const skill = read('.claude/skills/release/SKILL.md');
    const slug = PIN_PLACEHOLDER.replace(/#.*$/, ''); // github:tmhnsly/raditz
    expect(skill).toContain(`${slug}#`);
  });
});
