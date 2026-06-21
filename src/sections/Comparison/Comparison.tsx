import type { ReactNode } from 'react';
import { SectionShell, type SectionBaseProps } from '../../lib/SectionShell';

export interface ComparisonProps extends SectionBaseProps {
  /** Table columns (plans/tiers), in order (required). */
  columns: { name: ReactNode; highlight?: boolean }[];
  /** Feature rows (required). Each `values` entry aligns to the same-index column.
   *  `true` → check glyph; `false` → cross/em-dash; any ReactNode → rendered as-is. */
  rows: { feature: ReactNode; values: (boolean | ReactNode)[] }[];
  /** Section heading. */
  heading?: ReactNode;
}

function CellValue({ value }: { value: boolean | ReactNode }) {
  if (value === true) return <span className="cmp__yes">✓</span>;
  if (value === false) return <span className="cmp__no">—</span>;
  return <>{value}</>;
}

/** Comparison A — plans × features table, highlighted column for the popular tier. */
export function ComparisonA({ columns, rows, heading, background = 'surface-2', children, ...props }: ComparisonProps) {
  return (
    <SectionShell background={background} {...props}>
      {children ?? (
        <>
          {heading && <h3 className="h-section">{heading}</h3>}
          <div className="cmp-scroll">
            <table className="cmp">
              <thead>
                <tr>
                  <th></th>
                  {columns.map((col, i) => (
                    <th key={i} className={col.highlight ? 'cmp__pop' : undefined}>
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri}>
                    <th>{row.feature}</th>
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
