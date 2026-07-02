'use client';
import * as React from 'react';
import {
  useControllableState, cx, clamp,
  pageCount, pageSlice, pageRange,
  sortRows, nextSort, toggleSelected, togglePage, pageSelectionState,
} from '../../internal';
import type { Sort } from '../../internal';
import { Checkbox } from '../../inputs/Checkbox/Checkbox';
import { Button } from '../../actions/Button/Button';

const { useMemo, useState } = React;

type RowKey = string | number;
type DefaultRow = Record<string, unknown>;

export interface DataTableColumn<Row = DefaultRow> {
  /** Key into the row object. */
  key: string;
  header: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  /** CSS width (e.g. "8rem", "20%"). */
  width?: string;
  sortable?: boolean;
  /** Custom sort value (defaults to row[key]). */
  sortValue?: (row: Row) => string | number;
  /** Custom cell renderer. */
  render?: (value: unknown, row: Row) => React.ReactNode;
}

export interface DataTableProps<Row = DefaultRow> extends React.HTMLAttributes<HTMLDivElement> {
  columns?: DataTableColumn<Row>[];
  rows?: Row[];
  /** Unique key field on each row. @default "id" */
  rowKey?: string;
  /** Show row-selection checkboxes. @default false */
  selectable?: boolean;
  /** Controlled selected row keys. */
  selected?: RowKey[];
  onSelectedChange?: (selected: RowKey[]) => void;
  /** Initial sort, e.g. { key: 'name', dir: 'asc' }. */
  defaultSort?: { key: string; dir: 'asc' | 'desc' } | null;
  /** Rows per page (0 = no pagination). @default 0 */
  pageSize?: number;
  /** Tighter row height. @default false */
  dense?: boolean;
}

const ARROW = (dir: 'asc' | 'desc'): React.ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {dir === 'asc' ? <polyline points="6 14 12 8 18 14" /> : <polyline points="6 10 12 16 18 10" />}
  </svg>
);

/**
 * DataTable — a sortable, selectable table with a sticky header and optional
 * pagination. `columns` is `[{ key, header, align?, width?, sortable?, render? }]`
 * and `rows` is an array of objects keyed by `rowKey` (default "id").
 * `render(value, row)` customizes a cell. Set `selectable` for row checkboxes
 * (controlled via `selected` / `onSelectedChange`), and `pageSize` to paginate.
 */
export function DataTable<Row = DefaultRow>({
  columns = [],
  rows = [],
  rowKey = 'id',
  selectable = false,
  selected,
  onSelectedChange,
  defaultSort = null,
  pageSize = 0,
  dense = false,
  className,
  ...rest
}: DataTableProps<Row>): React.ReactElement {
  const [sort, setSort] = useState<Sort | null>(defaultSort);
  const [page, setPage] = useState(0);
  const [sel, setSel] = useControllableState<RowKey[]>({ value: selected, defaultValue: [], onChange: onSelectedChange });

  const getField = (row: Row, key: string): unknown => (row as Record<string, unknown>)[key];
  const getId = (row: Row): RowKey => getField(row, rowKey) as RowKey;

  // Sorting + selection rules live in the Table-model; paging math in the Page-model.
  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    return sortRows(rows, sort, (r) => (col && col.sortValue ? col.sortValue(r) : getField(r, sort.key)));
  }, [rows, sort, columns]);

  const pages = pageCount(sorted.length, pageSize);
  const safePage = clamp(page, 0, pages - 1); // survive rows/pageSize shrinking under a stale page
  const pageRows = pageSlice(sorted, safePage, pageSize);
  const range = pageRange(safePage, pageSize, sorted.length);

  const pageIds = pageRows.map(getId);
  const selState = pageSelectionState(sel, pageIds);
  const toggleSort = (col: DataTableColumn<Row>): void => {
    if (col.sortable) setSort((s) => nextSort(s, col.key));
  };
  const toggleAll = (): void => setSel(togglePage(sel, pageIds));
  const toggleRow = (id: RowKey): void => setSel(toggleSelected(sel, id));

  return (
    <div className={cx('rdz-table-wrap', 'rdz-scrollbar', className)} {...rest}>
      <table className={cx('rdz-table', dense && 'rdz-table--dense')}>
        <thead>
          <tr>
            {selectable ? (
              <th className="rdz-table__check">
                <Checkbox
                  checked={selState === 'all'}
                  indeterminate={selState === 'some'}
                  onChange={toggleAll}
                  aria-label="Select all rows"
                />
              </th>
            ) : null}
            {columns.map((c) => (
              <th
                key={c.key}
                style={{ '--rdz-col-align': c.align || 'left', '--rdz-col-w': c.width } as React.CSSProperties}
                className={c.sortable ? 'rdz-table__sortable' : undefined}
                aria-sort={sort && sort.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                onClick={() => toggleSort(c)}
              >
                <span className="rdz-table__th">
                  {c.header}
                  {c.sortable ? (
                    <span className={cx('rdz-table__sort', sort && sort.key === c.key && 'is-active')}>
                      {ARROW(sort && sort.key === c.key ? sort.dir : 'desc')}
                    </span>
                  ) : null}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageRows.map((r) => {
            const id = getId(r);
            const isSel = sel.includes(id);
            return (
              <tr key={id} data-selected={isSel || undefined}>
                {selectable ? (
                  <td className="rdz-table__check">
                    <Checkbox checked={isSel} onChange={() => toggleRow(id)} aria-label="Select row" />
                  </td>
                ) : null}
                {columns.map((c) => (
                  <td key={c.key} style={{ '--rdz-col-align': c.align || 'left' } as React.CSSProperties}>
                    {c.render ? c.render(getField(r, c.key), r) : (getField(r, c.key) as React.ReactNode)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {pageSize > 0 && pages > 1 ? (
        <div className="rdz-table__pager">
          <span className="rdz-table__pageinfo">
            {range.from}–{range.to} of {range.total}
          </span>
          <div className="rdz-table__pagebtns">
            <Button variant="soft" size="sm" disabled={safePage === 0} onClick={() => setPage((p) => clamp(p - 1, 0, pages - 1))}>
              Prev
            </Button>
            <Button variant="soft" size="sm" disabled={safePage >= pages - 1} onClick={() => setPage((p) => clamp(p + 1, 0, pages - 1))}>
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
