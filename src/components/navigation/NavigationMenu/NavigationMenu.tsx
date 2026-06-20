'use client';
import { useRef, useState } from 'react';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx, Overlay } from '../../internal';

export interface NavigationMenuItem {
  label: ReactNode;
  /** Link target for plain entries. */
  href?: string;
  /** If present, the entry opens a dropdown panel with this content. */
  content?: ReactNode;
}

export interface NavigationMenuProps extends HTMLAttributes<HTMLElement> {
  items?: NavigationMenuItem[];
}

/** One nav entry with a dropdown panel, rendered through the shared anchored
 * Overlay so it positions/flips/dismisses like Popover & DropdownMenu. */
function NavMenuGroup({
  item,
  open,
  onOpen,
  onClose,
}: {
  item: NavigationMenuItem;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}): ReactElement {
  const anchorRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="rdz-navmenu__group" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        ref={anchorRef}
        type="button"
        className="rdz-navmenu__trigger"
        aria-expanded={open}
        data-state={open ? 'on' : 'off'}
        onClick={() => (open ? onClose() : onOpen())}
      >
        {item.label}
        <svg className="rdz-navmenu__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <Overlay
        open={open}
        onDismiss={onClose}
        position={{ kind: 'anchored', anchor: anchorRef, side: 'bottom', align: 'start' }}
        ignore={anchorRef}
        focus="none"
        className="rdz-navmenu__panel"
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
      >
        {item.content}
      </Overlay>
    </div>
  );
}

/**
 * NavigationMenu — a horizontal site nav (Radix NavigationMenu). `items` is
 * `[{ label, href?, content? }]`: entries with `content` open a dropdown panel
 * on hover/focus; plain entries are links. Panels render through the shared
 * Overlay, so they match the rest of the overlay system.
 */
export function NavigationMenu({ items = [], className, ...rest }: NavigationMenuProps): ReactElement {
  const [open, setOpen] = useState<number>(-1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = (i: number): void => { if (timer.current) clearTimeout(timer.current); setOpen(i); };
  const hide = (): void => { if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(-1), 120); };
  return (
    <nav className={cx('rdz-navmenu', className)} {...rest}>
      {items.map((it, i) => (
        it.content ? (
          <NavMenuGroup key={i} item={it} open={open === i} onOpen={() => show(i)} onClose={hide} />
        ) : (
          <a key={i} className="rdz-navmenu__link" href={it.href || '#'}>{it.label}</a>
        )
      ))}
    </nav>
  );
}
