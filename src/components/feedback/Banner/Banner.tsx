'use client';
import * as React from 'react';
import { Icon } from '../../display/Icon/Icon';
import type { IconName } from '../../display/Icon/Icon';
import { cx, STATUS_TONE_ICON, statusToneRole } from '../../internal';
import type { FeedbackTone } from '../../internal';

export interface BannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** @default "info" */
  tone?: FeedbackTone;
  title?: React.ReactNode;
  /** Override the leading icon (registry name). */
  icon?: string;
  /** Trailing action node (e.g. a Button). */
  action?: React.ReactNode;
  /** Show a dismiss button wired to this handler. */
  onClose?: () => void;
  children?: React.ReactNode;
}

/**
 * Banner — an inline, full-width alert that sits in the layout (unlike the
 * floating Toast). `tone`: info | success | warning | danger. Optional `title`,
 * `action` node and `onClose`.
 */
export function Banner({
  tone = 'info',
  title,
  children,
  icon,
  action,
  onClose,
  className,
  ...rest
}: BannerProps): React.ReactElement {
  return (
    <div
      className={cx('rdz-banner', `rdz-banner--${tone}`, className)}
      role={statusToneRole(tone)}
      {...rest}
    >
      <Icon name={(icon || STATUS_TONE_ICON[tone]) as IconName} size="1.15rem" className="rdz-banner__icon" />
      <div className="rdz-banner__body">
        {title ? <div className="rdz-banner__title">{title}</div> : null}
        {children ? <div className="rdz-banner__text">{children}</div> : null}
      </div>
      {action ? <div className="rdz-banner__action">{action}</div> : null}
      {onClose ? (
        <button type="button" className="rdz-banner__close" aria-label="Dismiss" onClick={onClose}>
          <Icon name="x" size="1rem" />
        </button>
      ) : null}
    </div>
  );
}
