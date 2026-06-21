// Generates co-located smoke tests next to every component and section story.
// Each test renders every exported story via composeStories and asserts it mounts.
// Only creates the file if it does not already exist — hand-written extensions are preserved.
import fs from 'node:fs';
import { sourceSurface } from './public-surface.mjs';

const onlyArg = process.argv[2]; // optional "cat/Name" or "Name" to generate a single one

const componentTpl = (name) => `import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './${name}.stories';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('${name}', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(\`renders the \${storyName} story\`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});
`;

const sectionTpl = (name) => `import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './${name}.stories';

const composed = composeStories(stories);

describe('${name} (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(\`renders the \${storyName} story\`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});
`;

const { components, sections } = sourceSurface();
let count = 0;

for (const e of components) {
  if (onlyArg && onlyArg !== `${e.category}/${e.name}`) continue;
  if (!onlyArg && fs.existsSync(e.testFile)) continue; // preserve hand-written extensions
  fs.writeFileSync(e.testFile, componentTpl(e.name));
  count++;
}

for (const e of sections) {
  if (onlyArg && onlyArg !== e.name) continue;
  if (!onlyArg && fs.existsSync(e.testFile)) continue; // preserve hand-written extensions
  fs.writeFileSync(e.testFile, sectionTpl(e.name));
  count++;
}

console.log(`wrote ${count} test file(s)`);
