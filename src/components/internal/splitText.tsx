import * as React from 'react';

export type SplitBy = 'word' | 'char';

/**
 * Split a plain string into per-word or per-char `<span>`s for staggered text
 * animations. A11y-safe: the FULL text is rendered once in a visually-hidden span
 * for screen readers, and the animated unit spans are wrapped in `aria-hidden`, so
 * assistive tech reads the heading normally and never the fragments. Each unit
 * carries `--rdz-unit-i` (its index) for CSS stagger; whitespace passes through so
 * the text still wraps naturally.
 */
export function splitText(text: string, by: SplitBy = 'word'): React.ReactElement {
  const units = by === 'char' ? Array.from(text) : text.split(/(\s+)/);
  let i = 0;
  return (
    <>
      <span className="rdz-sr-only">{text}</span>
      <span aria-hidden="true">
        {units.map((u, idx) => {
          if (u === '') return null;
          if (/^\s+$/.test(u)) return <React.Fragment key={idx}>{u}</React.Fragment>;
          const n = i++;
          return (
            <span key={idx} className="rdz-split__unit" style={{ '--rdz-unit-i': n } as React.CSSProperties}>
              {u}
            </span>
          );
        })}
      </span>
    </>
  );
}
