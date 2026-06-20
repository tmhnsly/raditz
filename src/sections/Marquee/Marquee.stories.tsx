import type { Meta, StoryObj } from '@storybook/react';
import { MarqueeA } from './Marquee';

const meta: Meta = { title: 'Sections/Logo marquee' };
export default meta;
type Story = StoryObj;

export const A_LogoStrip: Story = {
  name: 'A · Auto-scrolling logo strip',
  render: () => (
    <MarqueeA
      items={[
        <strong key="1">Northwind</strong>,
        <strong key="2" className="sx-mq__mono">ACME</strong>,
        <strong key="3">LUMEN</strong>,
        <strong key="4" className="sx-mq__italic">Vertex</strong>,
        <strong key="5" className="sx-mq__tight">Hatch</strong>,
        <strong key="6">Aurora</strong>,
      ]}
    />
  ),
};
