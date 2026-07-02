'use client';
import { useRef, useState } from 'react';
import type { HTMLAttributes, KeyboardEvent as ReactKeyboardEvent, ReactElement, ReactNode } from 'react';
import { cx, rovingIndex } from '../../internal';

export interface TabItem {
  value: string;
  label: ReactNode;
  /**
   * id of the tabpanel this tab controls. When set, the tab gets
   * `aria-controls={panelId}` and its own id becomes `` `${panelId}-tab` `` so
   * the panel can point `aria-labelledby` back at the tab:
   *
   *   <div role="tabpanel" id={panelId} aria-labelledby={`${panelId}-tab`} />
   */
  panelId?: string;
}

/**
 * @startingPoint section="Navigation" subtitle="Tabs & tooltip" viewport="700x260"
 */
export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  /** Tab definitions. */
  tabs: TabItem[];
  /** Controlled active value. */
  value?: string;
  /** Initial value (uncontrolled). */
  defaultValue?: string;
  /** Fires on tab change. */
  onValueChange?: (value: string) => void;
  /** @default "segmented" */
  variant?: 'segmented' | 'underline';
  className?: string;
}

/**
 * A tab switcher. Pass `tabs` as { value, label } items. Controlled via `value`
 * + `onValueChange`, or uncontrolled with `defaultValue`. `variant` is the
 * segmented control (default) or an underline bar. Implements the WAI-ARIA tabs
 * pattern with automatic activation: the selected tab is the single tab stop and
 * ArrowLeft/ArrowRight/Home/End move focus AND selection together.
 */
export function Tabs({ tabs = [], value, defaultValue, onValueChange, variant = 'segmented', className, ...rest }: TabsProps): ReactElement {
  const [internal, setInternal] = useState<string | undefined>(defaultValue ?? tabs[0]?.value);
  const active = value !== undefined ? value : internal;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (v: string): void => { if (value === undefined) setInternal(v); onValueChange && onValueChange(v); };

  // Roving tabIndex: the selected tab is the tab stop (fall back to the first).
  const activeIdx = tabs.findIndex((t) => t.value === active);
  const focusIdx = activeIdx < 0 ? 0 : activeIdx;
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
    const next = rovingIndex(e.key, focusIdx, tabs.length, { orientation: 'horizontal', loop: true });
    if (next === null) return;
    e.preventDefault();
    const t = tabs[next];
    if (t) { select(t.value); tabRefs.current[next]?.focus(); }
  };

  return (
    <div role="tablist" className={cx('rdz-tabs', className)} data-variant={variant} onKeyDown={onKeyDown} {...rest}>
      {tabs.map((t, i) => (
        <button
          key={t.value}
          ref={(el) => { tabRefs.current[i] = el; }}
          role="tab"
          type="button"
          id={t.panelId ? `${t.panelId}-tab` : undefined}
          aria-selected={active === t.value}
          aria-controls={t.panelId}
          tabIndex={i === focusIdx ? 0 : -1}
          className={cx('rdz-tabs__tab', active === t.value && 'rdz-tabs__tab--active')}
          onClick={() => select(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
