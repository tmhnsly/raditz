import type { CSSProperties, HTMLAttributes, ReactElement } from 'react';
import { cx } from '../../internal';

const SIZE: Record<'sm' | 'md' | 'lg' | 'xl', number> = { sm: 28, md: 40, lg: 56, xl: 80 };

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Image source. */
  src?: string;
  alt?: string;
  /** Monogram fallback when there's no image. */
  initials?: string;
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  /** "orb" renders the accent gradient sphere. @default "solid" */
  variant?: 'solid' | 'orb';
}

/**
 * A user / brand avatar. Pass `src` for an image, or `initials` for a tinted
 * monogram. `variant="orb"` renders the accent gradient sphere (author orb).
 */
export function Avatar({
  src,
  alt = '',
  initials,
  size = 'md',
  variant = 'solid',
  className,
  style,
  ...rest
}: AvatarProps): ReactElement {
  const px = typeof size === 'number' ? size : SIZE[size];
  const cls = cx('srx-avatar', variant === 'orb' && 'srx-avatar--orb', className);
  return (
    <span
      className={cls}
      style={{ '--srx-avatar-size': `${px}px`, '--srx-avatar-fs': `${Math.round(px * 0.4)}px`, ...style } as CSSProperties}
      {...rest}
    >
      {src ? <img src={src} alt={alt} /> : variant === 'orb' ? null : initials}
    </span>
  );
}
