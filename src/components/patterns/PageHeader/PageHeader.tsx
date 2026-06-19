import * as React from 'react';
import { cx } from '../../internal';

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned actions (buttons, etc.). */
  actions?: React.ReactNode;
  /** Breadcrumb node placed above the title. */
  breadcrumb?: React.ReactNode;
}

/**
 * PageHeader — the standard top-of-page block: optional breadcrumb, an eyebrow,
 * a title, a description, and a right-aligned `actions` slot. Keeps every page's
 * header consistent instead of re-laying-out each time.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  breadcrumb,
  className,
  ...rest
}: PageHeaderProps): React.ReactElement {
  return (
    <header className={cx('srx-pageheader', className)} {...rest}>
      {breadcrumb ? <div className="srx-pageheader__crumb">{breadcrumb}</div> : null}
      <div className="srx-pageheader__row">
        <div className="srx-pageheader__head">
          {eyebrow ? (
            <span className="srx-eyebrow">
              <span className="srx-eyebrow__dot" />
              {eyebrow}
            </span>
          ) : null}
          {title ? <h1 className="srx-pageheader__title">{title}</h1> : null}
          {description ? <p className="srx-pageheader__desc">{description}</p> : null}
        </div>
        {actions ? <div className="srx-pageheader__actions">{actions}</div> : null}
      </div>
    </header>
  );
}
