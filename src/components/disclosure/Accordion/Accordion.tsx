import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { useControllableState, cx } from '../../internal';

export interface AccordionItem {
  value: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** One-open or many-open. @default "single" */
  type?: 'single' | 'multiple';
  /** In single mode, allow closing the open item. @default true */
  collapsible?: boolean;
  /** Sections to render. */
  items?: AccordionItem[];
  /** Controlled open value(s) — string for single, string[] for multiple. */
  value?: string | string[];
  /** Initial open value(s) (uncontrolled). */
  defaultValue?: string | string[];
  /** Fires when the open value(s) change. */
  onValueChange?: (value: string | string[]) => void;
}

/**
 * Accordion — a stack of collapsible sections (Radix Accordion). `type="single"`
 * keeps one open (set `collapsible` to allow none); `type="multiple"` lets any
 * number open. Items are `{ value, title, content, disabled? }`.
 */
export function Accordion({
  type = 'single',
  collapsible = true,
  items = [],
  value,
  defaultValue,
  onValueChange,
  className,
  ...rest
}: AccordionProps): ReactElement {
  const [open, setOpen] = useControllableState<string | string[]>({
    value,
    defaultValue: defaultValue ?? (type === 'multiple' ? [] : ''),
    onChange: onValueChange,
  });
  const isOpen = (v: string): boolean => (type === 'multiple' ? (((open as string[]) || []).includes(v)) : open === v);
  const toggle = (v: string): void => {
    if (type === 'multiple') {
      const arr = (open as string[]) || [];
      setOpen(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    } else {
      setOpen(open === v ? (collapsible ? '' : (open as string)) : v);
    }
  };
  return (
    <div className={cx('srx-accordion', className)} {...rest}>
      {items.map((it) => {
        const o = isOpen(it.value);
        return (
          <div className="srx-accordion__item" key={it.value} data-state={o ? 'open' : 'closed'}>
            <button
              type="button"
              className="srx-accordion__trigger"
              aria-expanded={o}
              disabled={it.disabled}
              onClick={() => toggle(it.value)}
            >
              <span>{it.title}</span>
              <svg className="srx-accordion__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className="srx-accordion__panel" role="region" hidden={!o}>
              <div className="srx-accordion__content">{it.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
