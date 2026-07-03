import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from './Chip.stories';
import { Chip } from './Chip';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Chip', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

describe('Chip — behaviour', () => {
  it('fires onDismiss from the × button without firing onClick', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const onClick = vi.fn();
    render(
      <Chip onClick={onClick} onDismiss={onDismiss} dismissLabel="Remove Design">
        Design
      </Chip>,
    );
    await user.click(screen.getByRole('button', { name: 'Remove Design' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('defaults the × label to "Remove"', () => {
    render(<Chip onDismiss={() => {}}>Tag</Chip>);
    expect(screen.getByRole('button', { name: 'Remove' })).toBeTruthy();
  });

  it('renders the body as a real button when onClick is set', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Chip onClick={onClick}>Open</Chip>);
    const body = screen.getByRole('button', { name: 'Open' });
    expect(body.tagName).toBe('BUTTON');
    await user.click(body);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders no button semantics when plain', () => {
    render(<Chip>Plain</Chip>);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('Plain').closest('.rdz-chip')?.tagName).toBe('SPAN');
  });

  it('blocks both handlers when disabled', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const onClick = vi.fn();
    render(
      <Chip disabled onClick={onClick} onDismiss={onDismiss}>
        Frozen
      </Chip>,
    );
    await user.click(screen.getByRole('button', { name: 'Frozen' }));
    await user.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onClick).not.toHaveBeenCalled();
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
