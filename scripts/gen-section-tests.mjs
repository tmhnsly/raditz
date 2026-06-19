// Generates a co-located smoke test next to every section story.
import fs from 'node:fs';
import path from 'node:path';

const root = 'src/sections';
const tpl = (name) => `import { describe, it, expect } from 'vitest';
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

let count = 0;
for (const name of fs.readdirSync(root)) {
  const dir = path.join(root, name);
  if (!fs.statSync(dir).isDirectory()) continue;
  if (!fs.existsSync(path.join(dir, `${name}.stories.tsx`))) continue;
  fs.writeFileSync(path.join(dir, `${name}.test.tsx`), tpl(name));
  count++;
}
console.log(`wrote ${count} section test file(s)`);
