import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './DataTable.stories';
import { DataTable } from './DataTable';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('DataTable', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'score', header: 'Score', sortable: true },
];
// Insertion order (Alan, Grace, Ada) differs from every sort, so reordering is observable.
const rows = [
  { id: 1, name: 'Alan', score: 95 },
  { id: 2, name: 'Grace', score: 99 },
  { id: 3, name: 'Ada', score: 98 },
];
const nameOrder = (c: HTMLElement): string[] =>
  [...c.querySelectorAll('tbody tr')].map((tr) => tr.querySelector('td')?.textContent ?? '');

describe('DataTable behaviour (wired to the Table-model)', () => {
  it('applies defaultSort (score desc) on first render', () => {
    const { container } = render(<DataTable columns={columns} rows={rows} defaultSort={{ key: 'score', dir: 'desc' }} />);
    expect(nameOrder(container)).toEqual(['Grace', 'Ada', 'Alan']); // 99, 98, 95
  });

  it('clicking a sortable header cycles ascending then descending', () => {
    const { container, getByText } = render(<DataTable columns={columns} rows={rows} />);
    fireEvent.click(getByText('Name'));
    expect(nameOrder(container)).toEqual(['Ada', 'Alan', 'Grace']);
    fireEvent.click(getByText('Name'));
    expect(nameOrder(container)).toEqual(['Grace', 'Alan', 'Ada']);
  });

  it('reports a row toggle via onSelectedChange', () => {
    const onSelectedChange = vi.fn();
    const { container } = render(<DataTable columns={columns} rows={rows} selectable onSelectedChange={onSelectedChange} />);
    const rowChecks = container.querySelectorAll('tbody input[type="checkbox"]');
    fireEvent.click(rowChecks[0]); // first rendered row = Alan (id 1)
    expect(onSelectedChange).toHaveBeenLastCalledWith([1]);
  });

  it('the header checkbox selects every row on the page', () => {
    const onSelectedChange = vi.fn();
    const { container } = render(<DataTable columns={columns} rows={rows} selectable onSelectedChange={onSelectedChange} />);
    fireEvent.click(container.querySelector('thead input[type="checkbox"]') as HTMLInputElement);
    expect(onSelectedChange).toHaveBeenLastCalledWith([1, 2, 3]);
  });

  it('paginates and reports a clamped 1-based range', () => {
    const { container, getByText } = render(<DataTable columns={columns} rows={rows} pageSize={2} />);
    expect(nameOrder(container)).toHaveLength(2);
    expect(container.querySelector('.srx-table__pageinfo')?.textContent).toBe('1–2 of 3');
    fireEvent.click(getByText('Next'));
    expect(nameOrder(container)).toHaveLength(1);
    expect(container.querySelector('.srx-table__pageinfo')?.textContent).toBe('3–3 of 3');
  });
});
