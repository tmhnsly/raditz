import * as React from 'react';
import { useControllableState, cx, pageCount } from '../../internal';

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

interface SortState {
  key: string;
  dir: 'asc' | 'desc';
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
  const [sort, setSort] = useState<SortState | null>(defaultSort);
  const [page, setPage] = useState(0);
  const [sel, setSel] = useControllableState<RowKey[]>({ value: selected, defaultValue: [], onChange: onSelectedChange });

  const getField = (row: Row, key: string): unknown => (row as Record<string, unknown>)[key];
  const getId = (row: Row): RowKey => getField(row, rowKey) as RowKey;

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    const get = (r: Row): unknown => (col && col.sortValue ? col.sortValue(r) : getField(r, sort.key));
    return [...rows].sort((a, b) => {
      const av = get(a);
      const bv = get(b);
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [rows, sort, columns]);

  const pages = pageCount(sorted.length, pageSize);
  const pageRows = pageSize > 0 ? sorted.slice(page * pageSize, page * pageSize + pageSize) : sorted;

  const toggleSort = (col: DataTableColumn<Row>): void => {
    if (!col.sortable) return;
    setSort((s) =>
      !s || s.key !== col.key ? { key: col.key, dir: 'asc' } : s.dir === 'asc' ? { key: col.key, dir: 'desc' } : null,
    );
  };
  const allOnPage = pageRows.length > 0 && pageRows.every((r) => sel.includes(getId(r)));
  const someOnPage = pageRows.some((r) => sel.includes(getId(r)));
  const toggleAll = (): void => {
    const ids = pageRows.map((r) => getId(r));
    setSel(allOnPage ? sel.filter((id) => !ids.includes(id)) : [...new Set([...sel, ...ids])]);
  };
  const toggleRow = (id: RowKey): void => setSel(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]);

  return (
    <div className={cx('srx-table-wrap', className)} {...rest}>
      <table className={cx('srx-table', dense && 'srx-table--dense')}>
        <thead>
          <tr>
            {selectable ? (
              <th className="srx-table__check">
                <label className="srx-check">
                  <input
                    type="checkbox"
                    checked={allOnPage}
                    ref={(el) => {
                      if (el) el.indeterminate = !allOnPage && someOnPage;
                    }}
                    onChange={toggleAll}
                  />
                  <span className="srx-check__box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                </label>
              </th>
            ) : null}
            {columns.map((c) => (
              <th
                key={c.key}
                style={{ '--srx-col-align': c.align || 'left', '--srx-col-w': c.width } as React.CSSProperties}
                className={c.sortable ? 'srx-table__sortable' : undefined}
                aria-sort={sort && sort.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                onClick={() => toggleSort(c)}
              >
                <span className="srx-table__th">
                  {c.header}
                  {c.sortable ? (
                    <span className={cx('srx-table__sort', sort && sort.key === c.key && 'is-active')}>
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
                  <td className="srx-table__check">
                    <label className="srx-check">
                      <input type="checkbox" checked={isSel} onChange={() => toggleRow(id)} />
                      <span className="srx-check__box">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    </label>
                  </td>
                ) : null}
                {columns.map((c) => (
                  <td key={c.key} style={{ '--srx-col-align': c.align || 'left' } as React.CSSProperties}>
                    {c.render ? c.render(getField(r, c.key), r) : (getField(r, c.key) as React.ReactNode)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {pageSize > 0 && pages > 1 ? (
        <div className="srx-table__pager">
          <span className="srx-table__pageinfo">
            {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="srx-table__pagebtns">
            <button type="button" className="srx-btn srx-btn--soft srx-btn--sm" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
              Prev
            </button>
            <button type="button" className="srx-btn srx-btn--soft srx-btn--sm" disabled={page >= pages - 1} onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}>
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
