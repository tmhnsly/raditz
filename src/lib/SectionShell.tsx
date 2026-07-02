import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { Frame } from './Frame';
import { InView } from './InView';
import { cx } from '../components/internal';
import { SectionBackground } from '../components/layout/SectionBackground';
import type { SectionBg } from '../components/layout/SectionBackground/SectionBackground';
import { Button, type ButtonProps } from '../components/actions/Button';
import type { IconName } from '../components/display/Icon/Icon';

export type { SectionBg } from '../components/layout/SectionBackground/SectionBackground';

/** Background controls every section variant accepts, so backgrounds are
 * configurable per instance (with a curated default) — not hard-wired. */
export interface SectionVariantProps {
  background?: SectionBg;
  parallax?: boolean;
  image?: string;
  video?: string;
  /** Darken an `image`/`video`/gradient backdrop so overlaid text stays legible
   *  (and content switches to on-dark tokens). Essential when using `image` as a
   *  full-bleed section background behind copy. */
  scrim?: boolean;
}

export interface SectionShellProps extends HTMLAttributes<HTMLDivElement> {
  /** Extra classes on the inner `.s-wrap` (grid + gap, e.g. "sx-g3 sx-gap-5"). */
  wrap?: string;
  /** Section padding. @default "default" */
  pad?: 'default' | 'sm' | 'none';
  /** Extra classes on the padding element (e.g. a section band background). */
  padClassName?: string;
  /** Optional decorative backdrop (composes SectionBackground). @default "none" */
  background?: SectionBg;
  /** Parallax the backdrop. @default false */
  parallax?: boolean;
  /** Image URL backdrop (overrides gradient). */
  image?: string;
  /** Video URL backdrop (overrides image + gradient). */
  video?: string;
  /** Darken the backdrop (scrim); the surface then scopes content to on-dark. */
  scrim?: boolean;
  /** A transparent nav rendered above the content, floating over the shared
   * background (the "hero bleed" effect). Pass a nav with no background. */
  nav?: ReactNode;
  /** The shell's OWN class on the preview Frame (e.g. "nav-frame", "ph--neutral").
   * Distinct from `className`, which is the consumer's class — both merge onto
   * the Frame root. */
  frameClassName?: string;
  /** Constrain the Frame width. */
  frameMaxWidth?: string;
  /** Content entrance choreography — the section's content blocks cascade in (staggered)
   *  in the app-wide entrance style (`data-reveal`). `'scroll'` (the default, also `true`)
   *  reveals on scroll-into-view; `'load'` plays a pure-CSS mount animation at first paint
   *  (no observer, no blank flash — use for above-the-fold sections like the hero);
   *  `false` is static. @default 'scroll' */
  animate?: boolean | 'scroll' | 'load';
  children?: ReactNode;
}

/**
 * SectionShell — the one home for the section layout boilerplate every section
 * variant used to repeat: the preview Frame + `.s-pad` padding + `.s-wrap`
 * max-width wrapper (where the responsive container-query lives), with an
 * optional SectionBackground. Sections become content + a shell choice instead
 * of re-typing the triple-nested wrapper ~50 times.
 *
 * The root is the Frame: `className`, `id` and any other div attributes
 * (`data-*`, aria, handlers) land there, so every section variant that spreads
 * its rest props into the shell supports anchoring (`id`), testing
 * (`data-testid`) and consumer classes for free.
 */
export function SectionShell({
  wrap,
  pad = 'default',
  padClassName,
  background = 'none',
  parallax = false,
  image,
  video,
  scrim = false,
  nav,
  frameClassName,
  frameMaxWidth,
  animate = 'scroll',
  className,
  children,
  ...rest
}: SectionShellProps) {
  const padClass = pad === 'sm' ? 's-pad-sm' : pad === 'none' ? undefined : 's-pad';
  // `scroll` routes content through InView (a client boundary that toggles `is-in` on
  // scroll-in; the staggered entrance is pure CSS via `.s-choreo`). `load` is pure CSS —
  // `.s-load` plays a mount keyframe at first paint, so above-the-fold content (the hero)
  // animates in with no observer/hydration wait. Either way children stay server-rendered.
  const mode = animate === true ? 'scroll' : animate; // 'scroll' | 'load' | false
  const wrapBody =
    mode === 'scroll' ? (
      <InView className={cx('s-wrap', 's-choreo', wrap)} inViewClassName="is-in">{children}</InView>
    ) : mode === 'load' ? (
      <div className={cx('s-wrap', 's-load', wrap)}>{children}</div>
    ) : (
      <div className={cx('s-wrap', wrap)}>{children}</div>
    );
  const inner = (
    <>
      {nav ? <div className="s-shell__nav">{nav}</div> : null}
      <div className={cx(padClass, padClassName)}>{wrapBody}</div>
    </>
  );
  const hasBg = background !== 'none' || !!image || !!video;
  return (
    <Frame className={cx(frameClassName, className)} maxWidth={frameMaxWidth} {...rest}>
      {hasBg ? (
        <SectionBackground background={background} parallax={parallax} image={image} video={video} scrim={scrim}>{inner}</SectionBackground>
      ) : (
        inner
      )}
    </Frame>
  );
}

/**
 * Renders the eyebrow + heading block shared across all content sections.
 * Returns `null` when both `eyebrow` and `heading` are absent so callers can
 * drop it in unconditionally. `className` defaults to `'col sx-sec__head'` and
 * carries each section's modifier (e.g. `"col sx-feat__head"`).
 */
export function SectionHeader({
  eyebrow,
  heading,
  className,
  headingClassName,
  align,
  as: HeadingTag = 'h2',
}: {
  eyebrow?: ReactNode;
  heading?: ReactNode;
  className?: string;
  /** Extra classes on the heading tag itself (e.g. a per-section text-measure or
   * ink class like `"sx-cta__title"`) — layout classes belong on `className`. */
  headingClassName?: string;
  /** Center or left-align the eyebrow + heading block. Omit to inherit the
   * section's default look. */
  align?: 'start' | 'center';
  /** Heading level for the title, so a page keeps a correct outline. Every
   * section heading defaults to `h2` (sibling of the hero's `h2`; the page/app
   * owns the `h1`), so sections composed on one page share one coherent level.
   * The visual size is fixed by `h-section` regardless of level. @default 'h2' */
  as?: 'h2' | 'h3' | 'h4';
}): ReactElement | null {
  if (!eyebrow && !heading) return null;
  return (
    <div className={cx(className ?? 'col sx-sec__head', align === 'center' && 'sx-center', align === 'start' && 'sx-align-start')}>
      {eyebrow && <span className="eyebrow2">{eyebrow}</span>}
      {heading && <HeadingTag className={cx('h-section', headingClassName)}>{heading}</HeadingTag>}
    </div>
  );
}

/**
 * The avatar + name/role attribution block every testimonial variant renders
 * (Testimonials A/B, TestimonialCarousel) — extracted here, like
 * {@link SectionActionButton}, because it crosses section families. Accepts the
 * shared `Testimonial` shape structurally (quote is ignored); `name`/`role` are
 * individually optional. `className` carries each variant's wrapper modifier
 * (e.g. `"sx-tst__person"`); `as` lets a `<figure>` caller render a semantic
 * `<figcaption>`; `metaClassName` extends the inner name/role column.
 */
export function TestimonialFigure({
  person,
  className,
  metaClassName,
  as: Tag = 'div',
}: {
  /** The attributee — structurally compatible with `Testimonial`. */
  person: { name?: ReactNode; role?: ReactNode; avatar?: ReactNode };
  /** Classes on the wrapping row (per-variant modifier rides here). */
  className?: string;
  /** Extra classes on the inner name/role column. */
  metaClassName?: string;
  /** Wrapper element — `'figcaption'` inside a `<figure>` quote card. @default 'div' */
  as?: 'div' | 'figcaption';
}): ReactElement {
  return (
    <Tag className={cx('row', className)}>
      {person.avatar}
      <div className={cx('col', metaClassName)}>
        {person.name && <strong className="sx-fs-body-s">{person.name}</strong>}
        {person.role && <span className="muted sx-fs-caption">{person.role}</span>}
      </div>
    </Tag>
  );
}

/**
 * A call-to-action a section renders as a {@link Button}. Prefer `href`
 * (Server-Component-safe) over `onClick` (which requires a client boundary).
 * Shared by every content-driven section's `actions` prop.
 */
export type SectionAction = {
  /** Visible button text. */
  label: string;
  /** Link target — renders an `<a>`. */
  href?: string;
  /** Click handler — renders a `<button>` (needs a client boundary). */
  onClick?: () => void;
  /** Button visual weight. @default Button's own default ("primary") */
  variant?: ButtonProps['variant'];
  /** Per-action size override (else inherits the `SectionActions` size). */
  size?: ButtonProps['size'];
  /** Leading icon — a registry name or a node. */
  icon?: IconName | ReactNode;
};

/**
 * The props every content-driven section variant accepts: the decorative
 * backdrop options ({@link SectionVariantProps}), the root passthrough
 * (`className` / `id` / `data-*`, carried by the variants' `{...props}` spread
 * to {@link SectionShell}'s root Frame), plus a `children` escape hatch
 * that, when provided, replaces the section's auto-rendered body. Section prop
 * interfaces (e.g. `HeroProps`) extend this and add their content fields.
 * (Deliberately NOT the full `HTMLAttributes` — its `title?: string` etc. would
 * collide with sections' own `title?: ReactNode` content props.)
 */
export type SectionBaseProps = SectionVariantProps & {
  /** Consumer class merged onto the section's root element. */
  className?: string;
  /** Anchor id on the section's root element (in-page nav targets). */
  id?: string;
  /** Content entrance choreography, forwarded to {@link SectionShell}: `'scroll'`
   *  (default) reveals on scroll, `'load'` animates on mount (above-the-fold heroes),
   *  `false` is static. @default 'scroll' */
  animate?: boolean | 'scroll' | 'load';
  /** Replaces the auto-rendered body inside the themed shell when provided. */
  children?: ReactNode;
  /** `data-*` attributes forwarded to the section root (e.g. `data-testid`). */
  [dataAttr: `data-${string}`]: string | undefined;
};

/**
 * Renders one {@link SectionAction} as a {@link Button}, forwarding every
 * field. `variant = action.variant ?? defaultVariant`; `size = action.size ?? size`.
 * This is the single path from a `SectionAction` to a rendered `<Button>` —
 * inline sites that used to construct `<Button>` by hand now delegate here so
 * field-forwarding is tested in one place.
 */
export function SectionActionButton({
  action,
  size,
  defaultVariant,
  className,
}: {
  action: SectionAction;
  size?: ButtonProps['size'];
  defaultVariant?: ButtonProps['variant'];
  className?: string;
}): ReactElement {
  return (
    <Button
      href={action.href}
      onClick={action.onClick}
      variant={action.variant ?? defaultVariant}
      size={action.size ?? size}
      icon={action.icon}
      className={className}
    >
      {action.label}
    </Button>
  );
}

/**
 * Renders a row of CTAs from `actions` as {@link Button}s. Returns `null` when
 * there are no actions, so callers can drop it in unconditionally. `size` sets
 * the default for every button (each action may override via its own `size`).
 * The shared CTA renderer for all content-driven sections.
 */
export function SectionActions({
  actions,
  size,
  className = 'row sx-row-center',
}: {
  /** The CTAs to render. */
  actions?: SectionAction[];
  /** Default size applied to every button (per-action `size` wins). */
  size?: ButtonProps['size'];
  /** Class on the wrapping row. @default "row sx-row-center" */
  className?: string;
}): ReactElement | null {
  if (!actions || actions.length === 0) return null;
  return (
    <div className={className}>
      {actions.map((action, i) => (
        <SectionActionButton
          key={action.href ?? action.label ?? i}
          action={action}
          size={size}
        />
      ))}
    </div>
  );
}
