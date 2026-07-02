import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from './Pagination.stories';
import { Pagination } from './Pagination';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Pagination', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

const btn = (name: string): HTMLButtonElement => screen.getByRole('button', { name }) as HTMLButtonElement;
const currentPage = (): string | undefined =>
  screen.getAllByRole('button').find((b) => b.getAttribute('aria-current') === 'page')?.textContent ?? undefined;

describe('Pagination — behaviour', () => {
  it('clicking a page button fires onChange with that page and moves aria-current', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination total={5} onChange={onChange} />);
    expect(currentPage()).toBe('1');

    await user.click(btn('3'));
    expect(onChange).toHaveBeenLastCalledWith(3);
    expect(currentPage()).toBe('3');
  });

  it('prev/next step one page and clamp via disabled ends', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination total={3} onChange={onChange} />);

    expect(btn('Previous page').disabled).toBe(true); // on first page
    expect(btn('Next page').disabled).toBe(false);

    await user.click(btn('Next page'));
    expect(onChange).toHaveBeenLastCalledWith(2);
    expect(btn('Previous page').disabled).toBe(false);

    await user.click(btn('Next page'));
    expect(onChange).toHaveBeenLastCalledWith(3);
    expect(btn('Next page').disabled).toBe(true); // on last page

    await user.click(btn('Previous page'));
    expect(onChange).toHaveBeenLastCalledWith(2);
  });

  it('shows a single trailing ellipsis at the start boundary', () => {
    render(<Pagination total={20} defaultPage={1} />);
    expect(screen.getAllByText('…')).toHaveLength(1);
    // 1..5 shown, then … 20
    ['1', '2', '3', '4', '5', '20'].forEach((n) => expect(btn(n)).toBeTruthy());
    expect(screen.queryByRole('button', { name: '6' })).toBeNull();
  });

  it('shows ellipses on both sides from the middle', () => {
    render(<Pagination total={20} defaultPage={10} />);
    expect(screen.getAllByText('…')).toHaveLength(2);
    ['1', '9', '10', '11', '20'].forEach((n) => expect(btn(n)).toBeTruthy());
    expect(currentPage()).toBe('10');
  });

  it('shows a single leading ellipsis at the end boundary', () => {
    render(<Pagination total={20} defaultPage={20} />);
    expect(screen.getAllByText('…')).toHaveLength(1);
    ['1', '16', '20'].forEach((n) => expect(btn(n)).toBeTruthy());
  });

  it('controlled: reports onChange but renders from the page prop', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination total={5} page={2} onChange={onChange} />);

    await user.click(btn('5'));
    expect(onChange).toHaveBeenCalledWith(5);
    expect(currentPage()).toBe('2'); // parent hasn't updated yet
  });
});
