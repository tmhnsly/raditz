import type { CSSProperties, HTMLAttributes, ReactElement } from 'react';
import { cx } from '../../internal';

const SIZES: Record<'sm' | 'md' | 'lg', string> = { sm: '1.75rem', md: '2.25rem', lg: '2.75rem' };

export interface AvatarGroupItem {
  initials?: string;
  src?: string;
  alt?: string;
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  items?: AvatarGroupItem[];
  /** Max avatars before collapsing to "+N". @default 4 */
  max?: number;
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * AvatarGroup — overlapping avatars with a "+N" overflow chip. `items` is
 * `[{ initials?, src?, alt? }]`; `max` caps how many show before collapsing.
 */
export function AvatarGroup({
  items = [],
  max = 4,
  size = 'md',
  className,
  ...rest
}: AvatarGroupProps): ReactElement {
  const dim = SIZES[size] || SIZES.md;
  const shown = items.slice(0, max);
  const extra = items.length - shown.length;
  return (
    <div
      className={cx('srx-avatar-group', className)}
      style={{ '--srx-avatar-group-dim': dim } as CSSProperties}
      {...rest}
    >
      {shown.map((it, i) => (
        <span
          key={i}
          className="srx-avatar srx-avatar-group__item"
          data-image={it && it.src ? '' : undefined}
          style={{
            '--srx-avatar-z': shown.length - i,
            ...(it && it.src ? { '--srx-avatar-group-img': `url(${it.src})` } : {}),
          } as CSSProperties}
          title={it.alt || it.initials}
        >
          {!it.src ? it.initials || '' : null}
        </span>
      ))}
      {extra > 0 ? (
        <span className="srx-avatar srx-avatar-group__item srx-avatar-group__more">+{extra}</span>
      ) : null}
    </div>
  );
}
