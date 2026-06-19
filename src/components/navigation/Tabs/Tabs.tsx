import { useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';

export interface TabItem {
  value: string;
  label: ReactNode;
}

/**
 * @startingPoint section="Navigation" subtitle="Tabs & tooltip" viewport="700x260"
 */
export interface TabsProps {
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
 * segmented control (default) or an underline bar.
 */
export function Tabs({ tabs = [], value, defaultValue, onValueChange, variant = 'segmented', className }: TabsProps): ReactElement {
  const [internal, setInternal] = useState<string | undefined>(defaultValue ?? tabs[0]?.value);
  const active = value !== undefined ? value : internal;
  const select = (v: string): void => { if (value === undefined) setInternal(v); onValueChange && onValueChange(v); };
  return (
    <div role="tablist" className={cx('srx-tabs', variant === 'underline' && 'srx-tabs--underline', className)}>
      {tabs.map((t) => (
        <button
          key={t.value}
          role="tab"
          type="button"
          aria-selected={active === t.value}
          className={cx('srx-tabs__tab', active === t.value && 'srx-tabs__tab--active')}
          onClick={() => select(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
