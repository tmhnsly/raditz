import type { Meta, StoryObj } from '@storybook/react';
import { ImageFocus } from './ImageFocus';

const meta: Meta<typeof ImageFocus> = { title: 'Sections/ImageFocus', component: ImageFocus };
export default meta;
type Story = StoryObj<typeof ImageFocus>;

const IMG = 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?auto=format&fit=crop&w=1920&q=70';

export const A_Hero: Story = {
  name: 'A · Media hero',
  render: () => (
    <ImageFocus
      image={IMG}
      size="hero"
      eyebrow="Farnham, Surrey"
      title="Step behind the decks"
      titleSize="display"
      sub="A purpose-built studio on flagship Pioneer equipment."
      actions={[
        { label: 'Book a session', href: '#' },
        { label: 'View rates', href: '#', variant: 'glass' },
      ]}
    />
  ),
};

export const B_Band: Story = {
  name: 'B · Inline band, text at bottom',
  render: () => (
    <ImageFocus image={IMG} size="band" place="bottom" align="start" title="Inside the studio" sub="Tuned to the room." />
  ),
};

export const C_ImageOnly: Story = {
  name: 'C · Image only (visual padding)',
  render: () => <ImageFocus image={IMG} size="band" scrim={false} />,
};
