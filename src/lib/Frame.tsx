import type { ReactNode } from 'react';

/**
 * Frame — previews a section inside a bordered, rounded card (matching the
 * original catalog). Use `bleed` for sections that paint their own full-bleed
 * background (accent bands, announcement strips) so the frame just clips them.
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
    <div className={`frame ${className}`} style={{ '--srx-frame-maxw': maxWidth, ...style } as React.CSSProperties}>
      {children}
    </div>
  );
}
