import type { Meta, StoryObj } from '@storybook/react';
import { FaqA, FaqB } from './Faq';

const meta: Meta = { title: 'Sections/FAQ' };
export default meta;
type Story = StoryObj;

const FAQ_ITEMS = [
  {
    question: 'How do I install it?',
    answer: 'Link one stylesheet in your <head>. styles.css is an import manifest that pulls in scales, tokens and components.',
  },
  {
    question: 'Can I change the accent color?',
    answer: 'Repoint the accent token block — every component, state and shadow follows automatically.',
  },
  {
    question: 'Is dark mode included?',
    answer: 'Yes — it follows the OS by default with a toggle to override. class="dark" on the root flips every token; content over dark media uses the on-dark surface context.',
  },
];

const FAQ_ITEMS_B = [
  { question: "What's the license?", answer: 'MIT — use it in commercial products freely.' },
  { question: 'Does it need a build step?', answer: 'No. It works from a CDN link, or self-host for production.' },
  { question: 'Which frameworks?', answer: 'Components are React; tokens and classes are framework-agnostic.' },
  { question: 'Can I extend it?', answer: 'Yes — add tokens and components; everything composes.' },
];

export const A_Accordion: Story = {
  name: 'A · Accordion',
  render: () => <FaqA items={FAQ_ITEMS} />,
};

export const B_TwoColumn: Story = {
  name: 'B · 2-column list',
  render: () => <FaqB items={FAQ_ITEMS_B} />,
};
