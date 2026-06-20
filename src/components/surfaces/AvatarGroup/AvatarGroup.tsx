import type { CSSProperties, HTMLAttributes, ReactElement } from 'react';
import { cx } from '../../internal';
import { Avatar } from '../Avatar/Avatar';
import { HoverCard } from '../../overlay/HoverCard/HoverCard';
import { Popover } from '../../overlay/Popover/Popover';

const SIZES: Record<'sm' | 'md' | 'lg', string> = { sm: '1.75rem', md: '2.25rem', lg: '2.75rem' };

export interface AvatarGroupItem {
  initials?: string;
  src?: string;
  alt?: string;
  /** Display name — shown in the hover card and the overflow list. */
  name?: string;
  /** Secondary line, e.g. a role or handle. */
  role?: string;
  /** Makes the avatar a link to the person's profile. */
  href?: string;
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  items?: AvatarGroupItem[];
  /** Max avatars before collapsing to "+N". @default 4 */
  max?: number;
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
}

const hasProfile = (it: AvatarGroupItem): boolean => Boolean(it.name || it.role || it.href);

/** The overlapping avatar chip — a link when the item has an `href`, else a span.
 *  `focusable` makes the (non-link) span keyboard-focusable so the hover card is
 *  reachable without a mouse. */
function Chip({ it, focusable = false }: { it: AvatarGroupItem; focusable?: boolean }): ReactElement {
  const cls = 'srx-avatar srx-avatar-group__item';
  const style = (it.src ? { '--srx-avatar-group-img': `url(${it.src})` } : {}) as CSSProperties;
  const content = it.src ? null : it.initials || '';
  const label = it.name || it.alt || it.initials || 'Avatar';
  return it.href ? (
    <a className={cls} href={it.href} data-image={it.src ? '' : undefined} style={style} aria-label={label}>{content}</a>
  ) : (
    <span className={cls} data-image={it.src ? '' : undefined} style={style} title={label} aria-label={focusable ? label : undefined} tabIndex={focusable ? 0 : undefined}>{content}</span>
  );
}

/** A profile row — used both in the hover card and the overflow list. */
function ProfileRow({ it }: { it: AvatarGroupItem }): ReactElement {
  const inner = (
    <>
      <Avatar size="sm" src={it.src} initials={it.initials} alt={it.alt} />
      <span className="srx-avatar-group__profile-text">
        {it.name ? <span className="srx-avatar-group__profile-name">{it.name}</span> : null}
        {it.role ? <span className="srx-avatar-group__profile-role">{it.role}</span> : null}
      </span>
    </>
  );
  return it.href ? (
    <a className="srx-avatar-group__profile" href={it.href}>{inner}</a>
  ) : (
    <span className="srx-avatar-group__profile">{inner}</span>
  );
}

/**
 * AvatarGroup — overlapping avatars with a "+N" overflow chip. `items` is
 * `[{ initials?, src?, alt?, name?, role?, href? }]`; `max` caps how many show
 * before collapsing. Items with profile info reveal a hover card (and link out
 * when given an `href`); the "+N" chip — always stacked on top — opens a popover
 * listing everyone.
 */
export function AvatarGroup({ items = [], max = 4, size = 'md', className, ...rest }: AvatarGroupProps): ReactElement {
  const dim = SIZES[size] || SIZES.md;
  const shown = items.slice(0, max);
  const extra = items.length - shown.length;
  return (
    <div className={cx('srx-avatar-group', className)} style={{ '--srx-avatar-group-dim': dim } as CSSProperties} {...rest}>
      {shown.map((it, i) => (
        <span className="srx-avatar-group__slot" key={i} style={{ '--srx-avatar-z': i + 1 } as CSSProperties}>
          {hasProfile(it) ? <HoverCard side="top" trigger={<Chip it={it} focusable />}><ProfileRow it={it} /></HoverCard> : <Chip it={it} />}
        </span>
      ))}
      {extra > 0 ? (
        // Highest z-index so the "+N" chip always sits on top of the stack.
        <span className="srx-avatar-group__slot" style={{ '--srx-avatar-z': shown.length + 1 } as CSSProperties}>
          <Popover
            side="bottom"
            align="end"
            trigger={
              <button type="button" className="srx-avatar srx-avatar-group__item srx-avatar-group__more" aria-label={`Show all ${items.length} people`}>
                +{extra}
              </button>
            }
          >
            <div className="srx-avatar-group__list srx-scrollbar">
              {items.map((it, i) => <ProfileRow key={i} it={it} />)}
            </div>
          </Popover>
        </span>
      ) : null}
    </div>
  );
}
