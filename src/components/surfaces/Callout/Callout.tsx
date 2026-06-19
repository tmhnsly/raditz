import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';

type Tone = 'accent' | 'info' | 'success' | 'warning' | 'danger';

export interface CalloutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Tone. @default "info" */
  color?: Tone;
  /** Leading icon element. */
  icon?: ReactNode;
  /** Optional bold title line. */
  title?: ReactNode;
  children?: ReactNode;
}

/**
 * A bordered, tinted message panel for inline notices. `color` sets the tone;
 * pass an `icon` element and optional `title`.
 */
export function Callout({ color = 'info', icon, title, className, children, ...rest }: CalloutProps): ReactElement {
  return (
    <div className={cx('srx-callout', className)} data-color={color} role="note" {...rest}>
      {icon && <span className="srx-callout__icon">{icon}</span>}
      <div className="srx-callout__body">
        {title && <div className="srx-callout__title">{title}</div>}
        {children}
      </div>
    </div>
  );
}
