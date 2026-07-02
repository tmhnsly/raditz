'use client';
import { useEffect, useRef } from 'react';
import type { ElementType, FocusEvent as ReactFocusEvent, HTMLAttributes, KeyboardEvent as ReactKeyboardEvent, ReactElement, ReactNode } from 'react';
import { cx, rovingIndex } from '../../internal';

export interface ToolbarProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
}

// Native controls a toolbar roves over. Disabled controls are skipped; elements
// we've set to tabIndex -1 must stay in the list, so no [tabindex] filtering.
const CONTROLS = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]';
const controls = (root: HTMLElement): HTMLElement[] => Array.from(root.querySelectorAll<HTMLElement>(CONTROLS));

/**
 * Toolbar — a horizontal container that groups actions (Radix Toolbar). Put
 * IconButtons, Buttons, Toggles and ToggleGroups inside; separate groups with
 * `<Separator orientation="vertical" />`. The toolbar is a single tab stop:
 * arrow keys (orientation from `aria-orientation`, horizontal by default) and
 * Home/End move focus between the controls inside it. Composite children that
 * handle their own arrow keys (e.g. a single-select ToggleGroup) call
 * preventDefault, so the toolbar leaves those events alone.
 */
export function Toolbar({ as: Tag = 'div', className, children, onKeyDown, onFocus, ...rest }: ToolbarProps): ReactElement {
  const rootRef = useRef<HTMLElement>(null);
  const orientation = rest['aria-orientation'] === 'vertical' ? 'vertical' : 'horizontal';

  // Roving DOM focus, 1-D (useGridFocus's style): the toolbar roves *arbitrary*
  // children, so a state index (useRoving) can't survive children mounting or
  // reordering — instead we query the live DOM per event and manage tabIndex
  // directly. Tradeoff: a child that manages its own tabIndex (ToggleGroup) can
  // reintroduce a second tab stop when it re-renders; the next focus inside the
  // toolbar normalises it again.
  const setTabStop = (root: HTMLElement, el: HTMLElement): void => {
    for (const c of controls(root)) c.tabIndex = c === el ? 0 : -1;
  };

  // On mount, collapse the toolbar to a single tab stop (its first control).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = controls(root);
    if (items[0]) setTabStop(root, items[0]);
  }, []);

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLElement>): void => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return; // a composite child (ToggleGroup, …) owns this key
    const items = controls(e.currentTarget);
    const i = items.indexOf(e.target as HTMLElement);
    if (i === -1) return;
    const next = rovingIndex(e.key, i, items.length, { orientation, loop: true });
    if (next === null) return;
    e.preventDefault();
    const el = items[next];
    if (el) { setTabStop(e.currentTarget, el); el.focus(); }
  };

  // Any control focused (arrow, click, Shift+Tab back in) becomes the tab stop,
  // so re-entering the toolbar resumes where the user left off.
  const handleFocus = (e: ReactFocusEvent<HTMLElement>): void => {
    onFocus?.(e);
    const target = e.target as HTMLElement;
    if (target.matches(CONTROLS)) setTabStop(e.currentTarget, target);
  };

  return (
    <Tag ref={rootRef} className={cx('rdz-toolbar', className)} role="toolbar" onKeyDown={handleKeyDown} onFocus={handleFocus} {...rest}>
      {children}
    </Tag>
  );
}
