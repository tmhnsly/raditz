import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export interface FrameProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Constrain the frame width (rides the `--rdz-frame-maxw` custom property). */
  maxWidth?: string;
}

/**
 * Frame — previews a section inside a bordered, rounded card (matching the
 * original catalog). Sections that paint their own full-bleed background
 * (accent bands, announcement strips) pass a `className` that flattens the
 * frame chrome so it just clips them. All other div attributes (`id`,
 * `data-*`, aria, handlers) spread onto the frame element, so callers can
 * anchor/test/style the section root directly.
 */
export function Frame({ children, className = '', style, maxWidth, ...rest }: FrameProps) {
  return (
    <div className={`frame ${className}`} style={{ '--rdz-frame-maxw': maxWidth, ...style } as CSSProperties} {...rest}>
      {children}
    </div>
  );
}
