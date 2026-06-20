import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Motion',
  parameters: {
    docs: { description: { component: 'A tunable "feel" system: five knobs (scale, ease, rise, pop, lift) drive all motion. Named presets are set via data-motion on any element. Durations derive from --motion-scale.' } },
  },
};
export default meta;
type Story = StoryObj;

const DURATIONS = ['duration-instant', 'duration-fast', 'duration-base', 'duration-medium', 'duration-slow'];
const PRESETS = ['snappy', 'smooth', 'calm', 'bouncy', 'mechanical'];

export const Durations: Story = {
  render: () => {
    const [on, setOn] = useState(false);
    return (
      <div style={{ maxWidth: 760 }}>
        <button
          className="rdz-btn rdz-btn--soft"
          onClick={() => setOn((v) => !v)}
          style={{ marginBottom: '1.5rem' }}
        >
          Toggle motion
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {DURATIONS.map((d) => (
            <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', width: 150, flex: 'none' }}>--{d}</code>
              <div style={{ flex: 1, height: 16, background: 'var(--surface)', borderRadius: 'var(--radius-full)', position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: on ? 'calc(100% - 16px)' : 0,
                    width: 16,
                    height: 16,
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--accent)',
                    transition: `left var(--${d}) var(--ease-standard)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '1.5rem', color: 'var(--text-soft)', fontSize: 'var(--fs-body-s)' }}>
          Presets (set <code style={{ fontFamily: 'var(--font-mono)' }}>data-motion</code>): {PRESETS.join(' · ')}
        </p>
      </div>
    );
  },
};
