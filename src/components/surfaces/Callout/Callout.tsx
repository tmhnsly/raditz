import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';
import type { StatusTone } from '../../internal';

export interface CalloutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Tone — every StatusTone except `neutral`. @default "info" */
  color?: Exclude<StatusTone, 'neutral'>;
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
    <div className={cx('rdz-callout', className)} data-color={color} role="note" {...rest}>
      {icon && <span className="rdz-callout__icon">{icon}</span>}
      <div className="rdz-callout__body">
        {title && <div className="rdz-callout__title">{title}</div>}
        {children}
      </div>
    </div>
  );
}
