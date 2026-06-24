'use client';
import type { ElementType, HTMLAttributes, ReactNode, Ref } from 'react';
import { cx, useInView } from '../components/internal';

export interface InViewProps extends HTMLAttributes<HTMLElement> {
  /** Element/tag to render. @default 'div' */
  as?: ElementType;
  /** Class added the first time the element scrolls into view. @default 'is-in' */
  inViewClassName?: string;
  /** Re-toggle every time it re-enters view (default latches once). @default false */
  repeat?: boolean;
  children?: ReactNode;
}

/**
 * InView — a thin client wrapper that toggles a class on its element the first time it
 * scrolls into view (via the shared {@link useInView} IntersectionObserver). The
 * animation itself is pure CSS, keyed off that class; InView only supplies the in-view
 * signal — so it composes with any class-driven scroll effect. SSR-safe: the class is
 * added client-side, and Raditz's reveal CSS is gated on `@media (scripting: enabled)`,
 * so server/no-JS renders the final visible state. Used by {@link SectionShell} for the
 * section content choreography; reusable on its own.
 */
export function InView({
  as: Tag = 'div',
  inViewClassName = 'is-in',
  repeat = false,
  className,
  children,
  ...rest
}: InViewProps) {
  const { ref, inView } = useInView<HTMLElement>({ once: !repeat });
  return (
    <Tag ref={ref as Ref<HTMLElement>} className={cx(className, inView && inViewClassName)} {...rest}>
      {children}
    </Tag>
  );
}
