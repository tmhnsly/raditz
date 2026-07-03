import type { Meta, StoryObj } from '@storybook/react';
import { Prose } from './Prose';

const meta = {
  title: 'Components/Typography/Prose',
  component: Prose,
  parameters: {
    docs: { description: { component: 'A long-form typography scope — rendered rich text inherits token-driven rhythm with no per-element classes.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Article: Story = {
  render: () => (
    <Prose>
      <h1>The shape of a design system</h1>
      <p className="lead">A design system is less a kit of parts than a set of agreements — about spacing, colour, and the words we use for both.</p>
      <p>
        Every component here reads from the same tokens, so a single accent change re-themes the
        whole page. This paragraph, a <a href="#">link</a>, some <strong>bold emphasis</strong> and
        a little <code>inline code</code> all sit on the same rhythm.
      </p>
      <h2>Principles</h2>
      <ul>
        <li>Author with semantic tokens, never raw values.</li>
        <li>Match sibling elements — one radius per group.</li>
        <li>Prefer container queries over breakpoints.</li>
      </ul>
      <blockquote>The backdrop should feel like depth, never decoration.</blockquote>
      <h3>A short list of steps</h3>
      <ol>
        <li>Pick the section variant.</li>
        <li>Feed it content through props.</li>
        <li>Ship — it re-themes for free.</li>
      </ol>
      <pre><code>{`import { Prose } from 'raditz';\n\n<Prose>{markdownHtml}</Prose>`}</code></pre>
      <hr />
      <p>Tables, images and figures inherit the same restraint.</p>
    </Prose>
  ),
};

export const Large: Story = {
  render: () => (
    <Prose size="lg">
      <h2>Larger reading size</h2>
      <p>The same scope one step up the body scale — for editorial pages that want a more generous measure and a calmer pace.</p>
    </Prose>
  ),
};
