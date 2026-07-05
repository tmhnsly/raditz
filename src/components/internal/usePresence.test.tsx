import { describe, it, expect } from 'vitest';
import { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import { usePresence } from './usePresence';

function Probe({ open }: { open: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { mounted, status } = usePresence(open, ref);
  return mounted ? <div ref={ref} data-testid="node" data-status={status}>on</div> : null;
}

describe('usePresence', () => {
  it('renders while open', () => {
    render(<Probe open />);
    const node = screen.getByTestId('node');
    expect(node.getAttribute('data-status')).toBe('open');
  });

  it('is not mounted when closed from the start', () => {
    render(<Probe open={false} />);
    expect(screen.queryByTestId('node')).toBeNull();
  });

  it('unmounts on close (immediately when there are no animations to wait on, e.g. jsdom)', () => {
    const { rerender } = render(<Probe open />);
    expect(screen.getByTestId('node')).toBeTruthy();
    rerender(<Probe open={false} />);
    // jsdom has no getAnimations → the closing effect unmounts synchronously.
    expect(screen.queryByTestId('node')).toBeNull();
  });

  it('re-mounts when re-opened', () => {
    const { rerender } = render(<Probe open={false} />);
    rerender(<Probe open />);
    expect(screen.getByTestId('node').getAttribute('data-status')).toBe('open');
  });
});
