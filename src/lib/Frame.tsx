import type { ReactNode } from 'react';

/**
 * Frame — previews a section inside a bordered, rounded card (matching the
 * original catalog). Sections that paint their own full-bleed background
 * (accent bands, announcement strips) pass a `className` that flattens the
 * frame chrome so it just clips them.
 */
export function Frame({
  children,
  className = '',
  style,
  maxWidth,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxWidth?: string;
}) {
  return (
    <div className={`frame ${className}`} style={{ '--rdz-frame-maxw': maxWidth, ...style } as React.CSSProperties}>
      {children}
    </div>
  );
}
