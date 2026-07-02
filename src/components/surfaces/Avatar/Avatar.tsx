import type { CSSProperties, HTMLAttributes, ReactElement } from "react";
import { cx } from "../../internal";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Image source. */
  src?: string;
  alt?: string;
  /** Monogram fallback when there's no image. */
  initials?: string;
  /** @default "md" */
  size?: "sm" | "md" | "lg" | "xl" | number;
  /** "orb" renders the accent gradient sphere. @default "solid" */
  variant?: "solid" | "orb";
}

/**
 * A user / brand avatar. Pass `src` for an image, or `initials` for a tinted
 * monogram. `variant="orb"` renders the accent gradient sphere; combine it with
 * `initials` for a monogram set into the orb surface.
 */
export function Avatar({
  src,
  alt = "",
  initials,
  size = "md",
  variant = "solid",
  className,
  style,
  ...rest
}: AvatarProps): ReactElement {
  // Preset sizes live in the stylesheet (data-size rules); a numeric size is
  // the escape hatch, passed as the same custom property the presets set.
  const custom = typeof size === "number";
  const cls = cx("rdz-avatar", className);
  return (
    <span
      className={cls}
      data-variant={variant}
      data-size={custom ? undefined : size}
      style={
        custom
          ? ({ "--rdz-avatar-size": `${size}px`, ...style } as CSSProperties)
          : style
      }
      {...rest}
    >
      {src ? (
        <img src={src} alt={alt} />
      ) : initials ? (
        <span className="rdz-avatar__initials">{initials}</span>
      ) : null}
    </span>
  );
}
