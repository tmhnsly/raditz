import type { Meta, StoryObj } from '@storybook/react';
import { StorySplitA, type StorySplitItem } from './StorySplit';
import { demoPhotos } from '../../demos/images';

const meta: Meta<typeof StorySplitA> = { title: 'Sections/StorySplit', component: StorySplitA };
export default meta;
type Story = StoryObj<typeof StorySplitA>;

const [ridge, fog, lake] = demoPhotos;

/** Three alternating editorial rows — image | copy, flipping each row. */
const editorialItems: StorySplitItem[] = [
  {
    image: ridge.src,
    imageAlt: ridge.alt,
    eyebrow: 'The route',
    title: 'Start above the treeline',
    body: 'Every trip opens on the high ridge, where the trail is wide and the views set the tone for the days below.',
    action: { label: 'Plan the ascent', href: '#' },
  },
  {
    image: fog.src,
    imageAlt: fog.alt,
    eyebrow: 'The descent',
    title: 'Drop into the fog forest',
    body: 'Mid-route the canopy closes in — cooler air, softer ground, and the quietest kilometres of the whole walk.',
    action: { label: 'See the forest leg', href: '#', variant: 'outline' },
  },
  {
    image: lake.src,
    imageAlt: lake.alt,
    eyebrow: 'The finish',
    title: 'End at the alpine lake',
    body: 'The last morning follows the shoreline to the boathouse, where the ferry brings you back to the valley.',
    action: { label: 'Book the trip', href: '#' },
  },
];

export const A_Alternating: Story = {
  name: 'A · Alternating rows',
  render: () => (
    <StorySplitA eyebrow="The journey" heading="Three days, three landscapes" items={editorialItems} />
  ),
};

export const B_SingleRow: Story = {
  name: 'B · Single row',
  render: () => (
    <StorySplitA
      items={[
        {
          image: lake.src,
          imageAlt: lake.alt,
          eyebrow: 'Basecamp',
          title: 'One cabin, whole lake',
          body: 'A single row works as a quiet mid-page feature — no section heading needed.',
          action: { label: 'Check availability', href: '#' },
        },
      ]}
    />
  ),
};

export const C_MediaNode: Story = {
  name: 'C · Custom media node',
  render: () => (
    <StorySplitA
      heading="Bring your own media"
      align="start"
      items={[
        {
          media: <div className="ph">Any node</div>,
          eyebrow: 'Media slot',
          title: 'The media prop overrides image',
          body: 'Pass any node — a chart, a video, a composed figure — and it rides the same clipped 4/3 frame.',
        },
      ]}
    />
  ),
};
