import type { Meta, StoryObj } from '@storybook/react';
import { Vignette, type VignetteBg } from './Vignette';

const meta: Meta<typeof Vignette> = { title: 'Components/Surfaces/Vignette', component: Vignette, parameters: { replay: true } };
export default meta;
type Story = StoryObj<typeof Vignette>;

const Scene = (
  <svg viewBox="0 0 80 56" width="50%" aria-hidden="true">
    <circle cx="40" cy="28" r="15" fill="none" stroke="currentColor" strokeWidth="3" />
    <circle cx="40" cy="28" r="4" fill="currentColor" />
  </svg>
);

const BGS: VignetteBg[] = ['plain', 'gradient', 'accent', 'secondary', 'mono', 'aurora'];

export const Backgrounds: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 12rem)', gap: '1rem' }}>
      {BGS.map((bg) => (
        <Vignette key={bg} bg={bg} scene={Scene} />
      ))}
    </div>
  ),
};
