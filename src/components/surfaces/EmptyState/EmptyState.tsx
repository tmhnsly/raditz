import * as React from 'react';
import { Icon } from '../../display/Icon/Icon';
import type { IconName } from '../../display/Icon/Icon';
import { Spinner } from '../../feedback/Spinner/Spinner';
import { cx } from '../../internal';
import type { StatusTone } from '../../internal';

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: IconName;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  /** Show a Spinner instead of the icon (loading state). @default false */
  loading?: boolean;
  /** @default "default" */
  tone?: 'default' | Extract<StatusTone, 'accent' | 'danger'>;
}

/**
 * EmptyState — one component for the empty / loading / error placeholder
 * patterns. Pass `icon` + `title` + `description` (+ optional `action`) for an
 * empty state; set `loading` to swap the icon for a Spinner; use `tone="danger"`
 * (with `icon="alert-triangle"`) for an error state.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  loading = false,
  tone = 'default',
  className,
  ...rest
}: EmptyStateProps): React.ReactElement {
  return (
    <div className={cx('rdz-emptystate', className)} data-color={tone === 'default' ? undefined : tone} role="status" {...rest}>
      <div className="rdz-emptystate__icon">
        {loading ? <Spinner size="1.6rem" /> : icon ? <Icon name={icon} size="1.6rem" /> : null}
      </div>
      {title ? <div className="rdz-emptystate__title">{title}</div> : null}
      {description ? <p className="rdz-emptystate__desc">{description}</p> : null}
      {action ? <div className="rdz-emptystate__action">{action}</div> : null}
    </div>
  );
}
