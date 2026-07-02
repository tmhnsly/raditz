import type { ReactNode } from 'react';
import { SectionShell, SectionHeader, type SectionBaseProps } from '../../lib/SectionShell';

export interface ComparisonProps extends SectionBaseProps {
  /** Table columns (plans/tiers), in order (required). */
  columns: { name: ReactNode; highlight?: boolean }[];
  /** Feature rows (required). `values` aligns positionally 1:1 with `columns`:
   *  `row.values[i]` is the cell for `columns[i]` (same length, same order).
   *  `true` → check glyph; `false` → cross/em-dash; any ReactNode → rendered as-is. */
  rows: { feature: ReactNode; values: (boolean | ReactNode)[] }[];
  /** Section heading. */
  heading?: ReactNode;
  /** Align the heading block: 'center' or 'start' (left). @default 'start' */
  align?: 'start' | 'center';
}

function CellValue({ value }: { value: boolean | ReactNode }) {
  if (value === true) return <span className="cmp__yes">✓</span>;
  if (value === false) return <span className="cmp__no">—</span>;
  return <>{value}</>;
}

/** Comparison A — plans × features table, highlighted column for the popular tier. */
export function ComparisonA({ columns, rows, heading, align, background = 'surface-2', children, ...props }: ComparisonProps) {
  return (
    <SectionShell background={background} {...props}>
      {children ?? (
        <>
          <SectionHeader heading={heading} align={align} />
          <div className="cmp-scroll">
            <table className="cmp">
              <thead>
                <tr>
                  {/* Corner cell: not a header (empty th fails the a11y gate). */}
                  <td></td>
                  {columns.map((col, i) => (
                    <th key={i} scope="col" className={col.highlight ? 'cmp__pop' : undefined}>
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri}>
                    {/* A row without a feature name (e.g. a CTA row) has no row header. */}
                    {row.feature ? <th scope="row">{row.feature}</th> : <td></td>}
                    {columns.map((col, ci) => {
                      const val = row.values[ci];
                      const isBoolFalse = val === false;
                      return (
                        <td
                          key={ci}
                          className={[
                            col.highlight ? 'cmp__pop' : undefined,
                            isBoolFalse ? 'cmp__no' : undefined,
                          ].filter(Boolean).join(' ') || undefined}
                        >
                          <CellValue value={val} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </SectionShell>
  );
}
