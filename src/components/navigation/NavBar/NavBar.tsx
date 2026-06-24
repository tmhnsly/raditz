'use client';
import { useRef, useState, useLayoutEffect, useCallback } from 'react';
import type { CSSProperties, HTMLAttributes, KeyboardEvent as ReactKeyboardEvent, ReactElement, ReactNode } from 'react';
import { useControllableState, cx, rovingIndex } from '../../internal';
import { Icon } from '../../display/Icon/Icon';
import type { IconName } from '../../display/Icon/Icon';

export interface NavBarItem {
  key: string;
  label?: ReactNode;
  icon?: IconName;
  href?: string;
}

export interface NavBarProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  items?: NavBarItem[];
  /** Active item key (controlled). */
  active?: string;
  /** Initial active key (uncontrolled; defaults to the first item). */
  defaultActive?: string;
  onChange?: (key: string) => void;
  /** Sliding highlight style. @default "pill" */
  variant?: 'pill' | 'underline';
  /** @default "horizontal" */
  orientation?: 'horizontal' | 'vertical';
}

interface Indicator {
  ready: boolean;
  transform?: string;
  width?: number;
  height?: number;
  left?: number;
  top?: number;
}

/**
 * NavBar — a route nav with a single indicator that *flows* between items as the
 * active one changes (measured from the live item rects, so it works at any
 * width). `items` is `[{ key, label, icon?, href? }]`. Controlled with `active`
 * / `onChange`, or uncontrolled with `defaultActive`. `variant`: 'pill' (filled
 * highlight that slides) or 'underline' (sliding bottom bar). `orientation`
 * 'horizontal' | 'vertical'.
 */
export function NavBar({
  items = [],
  active,
  defaultActive,
  onChange,
  variant = 'pill',
  orientation = 'horizontal',
  className,
  ...rest
}: NavBarProps): ReactElement {
  const [val, setVal] = useControllableState<string | undefined>({
    value: active,
    defaultValue: defaultActive ?? (items[0] && items[0].key),
    onChange: onChange as ((value: string | undefined) => void) | undefined,
  });
  const listRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const [ind, setInd] = useState<Indicator>({ ready: false });

  const measure = useCallback(() => {
    const el = val != null ? itemRefs.current[val] : null;
    const list = listRef.current;
    if (!el || !list) return;
    if (orientation === 'vertical') {
      setInd({ ready: true, transform: `translateY(${el.offsetTop}px)`, height: el.offsetHeight, width: el.offsetWidth, left: el.offsetLeft });
    } else {
      setInd({ ready: true, transform: `translateX(${el.offsetLeft}px)`, width: el.offsetWidth, height: el.offsetHeight, top: el.offsetTop });
    }
  }, [val, orientation]);

  useLayoutEffect(() => {
    measure();
    const list = listRef.current;
    if (!list || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [measure]);

  const cls = cx('rdz-navbar', `rdz-navbar--${variant}`, `rdz-navbar--${orientation}`, className);
  const indStyle: CSSProperties = ind.ready
    ? { transform: ind.transform, width: ind.width, height: ind.height, left: ind.left, top: ind.top, opacity: 1 }
    : { opacity: 0 };

  const onKeyDown = (e: ReactKeyboardEvent): void => {
    const i = items.findIndex((it) => it.key === val);
    const next = rovingIndex(e.key, i, items.length, { orientation: orientation === 'vertical' ? 'vertical' : 'horizontal', loop: true });
    if (next !== null) { e.preventDefault(); setVal(items[next].key); }
  };

  return (
    <nav className={cls} ref={listRef} role="tablist" aria-orientation={orientation} onKeyDown={onKeyDown} {...rest}>
      <span className="rdz-navbar__indicator" style={indStyle} aria-hidden="true" />
      {items.map((it) => {
        const isActive = it.key === val;
        const Tag = it.href ? 'a' : 'button';
        return (
          <Tag
            key={it.key}
            ref={(el: HTMLElement | null) => { itemRefs.current[it.key] = el; }}
            className="rdz-navbar__item"
            href={it.href}
            type={it.href ? undefined : 'button'}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            data-active={isActive ? 'true' : undefined}
            onClick={() => setVal(it.key)}
          >
            {it.icon ? <Icon name={it.icon} size="1.1em" /> : null}
            {it.label ? <span>{it.label}</span> : null}
          </Tag>
        );
      })}
    </nav>
  );
}
