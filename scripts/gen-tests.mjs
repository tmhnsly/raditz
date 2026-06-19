// Generates a co-located smoke test next to every component story.
// Each test renders every exported story via composeStories and asserts it mounts.
import fs from 'node:fs';
import path from 'node:path';

const root = 'src/components';
const onlyArg = process.argv[2]; // optional "cat/Name" to generate a single one

const tpl = (name) => `import { describe, it, expect } from 'vitest';
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

let count = 0;
for (const cat of fs.readdirSync(root)) {
  const catDir = path.join(root, cat);
  if (cat === 'internal' || !fs.statSync(catDir).isDirectory()) continue;
  for (const name of fs.readdirSync(catDir)) {
    const dir = path.join(catDir, name);
    if (!fs.statSync(dir).isDirectory()) continue;
    if (onlyArg && onlyArg !== `${cat}/${name}`) continue;
    const storyFile = path.join(dir, `${name}.stories.tsx`);
    if (!fs.existsSync(storyFile)) continue;
    fs.writeFileSync(path.join(dir, `${name}.test.tsx`), tpl(name));
    count++;
  }
}
console.log(`wrote ${count} test file(s)`);
