import type { Meta, StoryObj } from '@storybook/react';
import { Marquee } from './Marquee';

const meta: Meta<typeof Marquee> = { title: 'Components/Media/Marquee', component: Marquee };
export default meta;
type Story = StoryObj<typeof Marquee>;

const LOGOS = ['Northwind', 'ACME', 'LUMEN', 'Vertex', 'Hatch', 'Cobalt', 'Lattice'];

export const Logos: Story = {
  render: () => (
    <Marquee>
      {LOGOS.map((l) => (
        <strong key={l} style={{ fontSize: '1.125rem', opacity: 0.75 }}>{l}</strong>
      ))}
    </Marquee>
  ),
};

export const Reverse: Story = {
  render: () => (
    <Marquee direction="right" duration={18}>
      {LOGOS.map((l) => (
        <span key={l} className="rdz-badge rdz-badge--soft">{l}</span>
      ))}
    </Marquee>
  ),
};
