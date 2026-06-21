import type { ReactNode } from 'react';
import { SectionShell, type SectionBaseProps } from '../../lib/SectionShell';

export interface FooterProps extends SectionBaseProps {
  /** Link columns rendered by FooterA. */
  columns?: { heading: ReactNode; links: { label: ReactNode; href?: string }[] }[];
  /** Brand block rendered by FooterA. */
  brand?: { name: ReactNode; logo?: ReactNode; blurb?: ReactNode };
  /** Copyright text rendered by FooterB. */
  copyright?: ReactNode;
}

/** FooterA — brand block + link columns grid. */
export function FooterA({ brand, columns, background = 'none', children, ...props }: FooterProps) {
  return (
    <SectionShell padClassName="sx-foot__panel" wrap="sx-footer sx-gap-6" background={background} {...props}>
      {children ?? (
        <>
          {brand && (
            <div className="col sx-foot__brand">
              <div className="row sx-foot__brand-row">
                {brand.logo ?? <span className="feat-ico sx-foot__logo"><span className="sx-foot__logo-glyph">S</span></span>}
                <strong>{brand.name}</strong>
              </div>
              {brand.blurb && <span className="muted sx-body-s">{brand.blurb}</span>}
            </div>
          )}
          {columns && columns.map((col, i) => (
            <div key={i} className="col sx-foot__col">
              <strong className="sx-foot__col-head">{col.heading}</strong>
              {col.links.map((link, j) =>
                link.href
                  ? <a key={j} className="muted" href={link.href}>{link.label}</a>
                  : <span key={j} className="muted">{link.label}</span>
              )}
            </div>
          ))}
        </>
      )}
    </SectionShell>
  );
}

/** FooterB — compact copyright bar + link row. */
export function FooterB({ copyright, columns, background = 'none', children, ...props }: FooterProps) {
  const links = columns?.flatMap(col => col.links) ?? [];
  return (
    <SectionShell pad="sm" padClassName="sx-foot__bar" wrap="row sx-foot__bar-inner" background={background} {...props}>
      {children ?? (
        <>
          {copyright && (
            <div className="row sx-foot__bar-brand">
              <span className="feat-ico sx-foot__logo-sm"><span className="sx-foot__logo-glyph-sm">S</span></span>
              <span className="muted sx-fs-body-s">{copyright}</span>
            </div>
          )}
          {links.length > 0 && (
            <nav className="row sx-foot__nav">
              {links.map((link, i) =>
                link.href
                  ? <a key={i} href={link.href}>{link.label}</a>
                  : <span key={i}>{link.label}</span>
              )}
            </nav>
          )}
        </>
      )}
    </SectionShell>
  );
}
