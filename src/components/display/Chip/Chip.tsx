'use client';
import * as React from 'react';
import { cx } from '../../internal';

// NOTE: TagInput's internal `.rdz-tag` (src/components/inputs/TagInput) renders the
// same shape — a pill-shaped label with a removable ×. It is a candidate to adopt
// Chip (variant="soft" + onDismiss) in a later refactor; deliberately not touched here.

export interface ChipProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  /** Leading icon / visual. */
  icon?: React.ReactNode;
  /** When set, renders a trailing × button that fires this callback. */
  onDismiss?: () => void;
  /** Accessible label for the × button. @default "Remove" */
  dismissLabel?: string;
  /** When set, the chip body is a real <button>. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Fill style. @default "soft" */
  variant?: 'soft' | 'outline' | 'solid';
  /** Scale. @default "md" */
  size?: 'sm' | 'md';
  /** Disables both the body button and the × button. @default false */
  disabled?: boolean;
  children?: React.ReactNode;
}

const DismissGlyph = (): React.ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

/**
 * A compact pill-shaped token — selected filters, tags, people. `icon` leads,
 * `onDismiss` adds a labelled trailing × button, `onClick` makes the body a real
 * button. `variant` is the fill style, `size` the scale.
 */
export function Chip({
  icon,
  onDismiss,
  dismissLabel = 'Remove',
  onClick,
  variant = 'soft',
  size = 'md',
  disabled = false,
  className,
  children,
  ...rest
}: ChipProps): React.ReactElement {
  const lead = icon != null ? <span className="rdz-chip__icon" aria-hidden="true">{icon}</span> : null;

  // Clickable, no dismiss → the chip itself is the button.
  if (onClick && !onDismiss) {
    return (
      <button
        type="button"
        className={cx('rdz-chip', 'is-interactive', disabled && 'is-disabled', className)}
        data-variant={variant}
        data-size={size}
        disabled={disabled}
        onClick={onClick}
        {...rest}
      >
        {lead}
        {children}
      </button>
    );
  }

  const body = onClick ? (
    <button type="button" className="rdz-chip__body" disabled={disabled} onClick={onClick}>
      {lead}
      {children}
    </button>
  ) : (
    <>
      {lead}
      {children}
    </>
  );

  return (
    <span
      className={cx('rdz-chip', onClick && 'is-interactive', disabled && 'is-disabled', className)}
      data-variant={variant}
      data-size={size}
      {...rest}
    >
      {body}
      {onDismiss ? (
        <button
          type="button"
          className="rdz-chip__x"
          aria-label={dismissLabel}
          disabled={disabled}
          onClick={() => onDismiss()}
        >
          <DismissGlyph />
        </button>
      ) : null}
    </span>
  );
}
