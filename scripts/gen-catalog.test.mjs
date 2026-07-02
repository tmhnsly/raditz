import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  storyExportNames,
  fmtProp,
  usageSnippet,
  parseExportNames,
  extractLeadingDesc,
  renderUtilityEntry,
  UTILITIES,
  HEADER_CLASSES,
} from './gen-catalog.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describe('storyExportNames', () => {
  it('extracts typed CSF named exports', () => {
    const src = `export const Primary: Story = {};\nexport const WithIcon: Story = { args: {} };`;
    expect(storyExportNames(src)).toEqual(['Primary', 'WithIcon']);
  });

  it('extracts untyped const exports (the `= ` form)', () => {
    expect(storyExportNames(`export const Playground = { render: () => null };`)).toEqual([
      'Playground',
    ]);
  });

  it('ignores the default export and non-exported consts', () => {
    const src = [
      `const meta = { title: 'Components/Actions/Button' };`,
      `export default meta;`,
      `export const Default: Story = {};`,
    ].join('\n');
    expect(storyExportNames(src)).toEqual(['Default']);
  });
});

describe('fmtProp', () => {
  it('renders a required prop with its plain type', () => {
    expect(fmtProp({ name: 'label', required: true, type: { name: 'string' } })).toBe(
      '  - label: string',
    );
  });

  it('marks optional props with ? and appends default + description', () => {
    const p = {
      name: 'size',
      required: false,
      type: { name: 'string' },
      defaultValue: { value: 'md' },
      description: 'Control   size,\n  fluid.',
    };
    expect(fmtProp(p)).toBe('  - size?: string (default: md) — Control size, fluid.');
  });

  it('omits the default when it is empty/null', () => {
    const base = { name: 'x', required: false, type: { name: 'number' } };
    expect(fmtProp({ ...base, defaultValue: { value: '' } })).toBe('  - x?: number');
    expect(fmtProp({ ...base, defaultValue: { value: null } })).toBe('  - x?: number');
  });

  it('expands enum members to a literal union, dropping `undefined`', () => {
    const p = {
      name: 'tone',
      required: false,
      type: { name: 'enum', value: [{ value: "'accent'" }, { value: "'danger'" }, { value: 'undefined' }] },
    };
    expect(fmtProp(p)).toBe("  - tone?: 'accent' | 'danger'");
  });

  it('expands at exactly 12 members but keeps `enum` beyond the cap', () => {
    const members = (n) => Array.from({ length: n }, (_, i) => ({ value: `'v${i}'` }));
    const at12 = { name: 'p', required: true, type: { name: 'enum', value: members(12) } };
    expect(fmtProp(at12)).toBe(`  - p: ${members(12).map((m) => m.value).join(' | ')}`);
    const at13 = { name: 'p', required: true, type: { name: 'enum', value: members(13) } };
    expect(fmtProp(at13)).toBe('  - p: enum');
  });

  it('falls back to `unknown` when the type is missing', () => {
    expect(fmtProp({ name: 'mystery', required: true })).toBe('  - mystery: unknown');
  });
});

describe('usageSnippet', () => {
  it('renders hooks (use*) as a call, not JSX', () => {
    expect(usageSnippet({ displayName: 'useInView', props: {} })).toBe(
      'const result = useInView();',
    );
  });

  it('wraps children-accepting components and self-closes the rest', () => {
    expect(usageSnippet({ displayName: 'Card', props: { children: {} } })).toBe('<Card>…</Card>');
    expect(usageSnippet({ displayName: 'Spinner', props: {} })).toBe('<Spinner />');
  });
});

describe('parseExportNames', () => {
  it('parses every declaration form (incl. async), sorted', () => {
    const src = [
      `export function fnA() {}`,
      `export async function fnB() {}`,
      `export const constC = 1;`,
      `export let letD = 2;`,
      `export type TypeE = string;`,
      `export interface InterfaceF { x: number }`,
      `export class ClassG {}`,
      `export enum EnumH { One }`,
    ].join('\n');
    expect(parseExportNames(src)).toEqual([
      'ClassG', 'EnumH', 'InterfaceF', 'TypeE', 'constC', 'fnA', 'fnB', 'letD',
    ]);
  });

  it('parses re-exports, using the exported name for `X as Y`', () => {
    expect(parseExportNames(`export { alpha, beta as gamma };`)).toEqual(['alpha', 'gamma']);
  });

  it('handles multi-line re-export braces', () => {
    expect(parseExportNames(`export {\n  one,\n  two as deux,\n};`)).toEqual(['deux', 'one']);
  });

  it('dedupes and ignores non-exported declarations', () => {
    const src = `const hidden = 1;\nexport const shown = 2;\nexport { shown };`;
    expect(parseExportNames(src)).toEqual(['shown']);
  });
});

describe('extractLeadingDesc', () => {
  it('strips the JSDoc frame from a leading block comment', () => {
    const src = `/**\n * One shared store.\n * Second line.\n */\nimport x from 'y';`;
    expect(extractLeadingDesc(src)).toBe('One shared store.\nSecond line.');
  });

  it('returns empty when the file does not START with a JSDoc block', () => {
    expect(extractLeadingDesc(`import x from 'y';\n/** later */`)).toBe('');
    expect(extractLeadingDesc(`// line comment first\n/** later */`)).toBe('');
  });
});

describe('renderUtilityEntry', () => {
  it('composes the import line, description, exports and non-JSX note', () => {
    const src = `/** Tiny helpers. */\nexport const KEY = 'k';\nexport function init() {}`;
    expect(renderUtilityEntry('helpers', src)).toBe(
      [
        '### helpers',
        "Import: `import { KEY, init } from 'raditz'`",
        '',
        'Tiny helpers.',
        '',
        'Exports:',
        '  - KEY',
        '  - init',
        '',
        '> Note: This is a utility/hook module, not a React component — do not render as JSX.',
      ].join('\n'),
    );
  });

  it('uses the generic description when there is no leading JSDoc', () => {
    expect(renderUtilityEntry('m', 'export const a = 1;')).toContain(
      'Utility module — see exports below.',
    );
  });
});

describe('UTILITIES ↔ shipped CSS', () => {
  // The catalog's hand-authored utilities list must only advertise classes that the
  // shipped stylesheet actually defines. Style sources per src/styles/bundle.ts:
  // styles.css + tokens (src/styles/**), section utilities + co-located section CSS
  // (src/sections/**), and the component/pages .scss glob.
  const STYLE_GLOBS = [
    ['src/styles', '.css'],
    ['src/sections', '.css'],
    ['src/components', '.scss'],
    ['src/pages', '.scss'],
  ];

  function collectStyleSource() {
    let out = '';
    const walk = (dir, ext) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, ext);
        else if (entry.name.endsWith(ext)) out += fs.readFileSync(full, 'utf8') + '\n';
      }
    };
    for (const [dir, ext] of STYLE_GLOBS) walk(path.join(ROOT, dir), ext);
    return out;
  }

  const css = collectStyleSource();
  // '.row / .col' advertises two classes — split each entry into its class tokens.
  // HEADER_CLASSES are the page-level classes the header prose names (rdz-page /
  // rdz-bleed) — same contract: advertised ⇒ shipped.
  const advertised = [...UTILITIES.flatMap(([cls]) => cls.split(' / ')), ...HEADER_CLASSES];

  it.each(advertised)('%s is defined in the shipped styles', (cls) => {
    // Match the exact class selector; `(?![\w-])` stops `.eyebrow` matching `.eyebrow2`.
    const selector = new RegExp(`\\${cls}(?![\\w-])`);
    expect(css).toMatch(selector);
  });

  it.each(HEADER_CLASSES)('%s is still named by the catalog header prose (staleness guard)', (cls) => {
    const gen = fs.readFileSync(path.join(ROOT, 'scripts/gen-catalog.mjs'), 'utf8');
    // The bare name must appear AFTER the HEADER_CLASSES declaration — i.e. in
    // main()'s header template strings, not just in the list (or its comment).
    const afterDecl = gen.split('export const HEADER_CLASSES')[1]?.split('];').slice(1).join('];') ?? '';
    expect(afterDecl, `${cls} left the header prose — drop it from HEADER_CLASSES`).toContain(cls.slice(1));
  });
});
