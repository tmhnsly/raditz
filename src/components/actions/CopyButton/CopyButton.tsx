'use client';
import * as React from 'react';
import { Icon } from '../../display/Icon/Icon';
import { VisuallyHidden } from '../../typography/VisuallyHidden/VisuallyHidden';
import { cx } from '../../internal';

/** How long the "copied" confirmation shows before reverting. */
const COPIED_MS = 1600;

export interface CopyButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** The text written to the clipboard on activation. */
  value: string;
  /** Accessible label (`aria-label` + `title`). @default "Copy" */
  label?: string;
  /** Label shown/announced after a successful copy. @default "Copied" */
  copiedLabel?: string;
  /** Control size. @default "md" */
  size?: 'sm' | 'md';
  /** Visual weight. @default "ghost" */
  variant?: 'ghost' | 'outline';
  /** Optional visible text rendered beside the icon (icon-only otherwise). */
  children?: React.ReactNode;
}

/**
 * Writes `value` to the clipboard, falling back to a hidden textarea +
 * `execCommand('copy')` where the async Clipboard API is unavailable
 * (non-secure contexts, older browsers). Resolves `true` on success.
 */
async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Clipboard API refused (permissions) — fall through to the textarea path.
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    // Off-screen via the shared sr-only class — no inline styles.
    ta.className = 'rdz-visually-hidden';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

/**
 * Copy-to-clipboard button. Icon-only by default (pass an `aria-label` via
 * `label`); pass `children` for a visible text label beside the icon. On a
 * successful copy the glyph swaps to a check and the label to `copiedLabel`
 * for a moment, and the result is announced politely to screen readers.
 */
export function CopyButton({
  value,
  label = 'Copy',
  copiedLabel = 'Copied',
  size = 'md',
  variant = 'ghost',
  type = 'button',
  className,
  onClick,
  children,
  ...rest
}: CopyButtonProps): React.ReactElement {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);

  // Clear the revert timer on unmount so it never fires into a dead component.
  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    const ok = await writeClipboard(value);
    if (!ok) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), COPIED_MS);
  };

  return (
    <button
      type={type}
      className={cx('rdz-copybtn', className)}
      data-variant={variant}
      data-size={size}
      data-copied={copied || undefined}
      data-labelled={children != null ? '' : undefined}
      aria-label={copied ? copiedLabel : label}
      title={copied ? copiedLabel : label}
      onClick={handleClick}
      {...rest}
    >
      <Icon name={copied ? 'check' : 'copy'} size="1.15em" />
      {children != null && <span className="rdz-copybtn__label">{copied ? copiedLabel : children}</span>}
      {/* Polite announcement — aria-label swaps silently, this speaks it. */}
      <VisuallyHidden aria-live="polite">{copied ? copiedLabel : ''}</VisuallyHidden>
    </button>
  );
}
