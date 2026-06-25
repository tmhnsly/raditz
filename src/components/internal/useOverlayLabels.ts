'use client';
import { useId } from 'react';
import type { ReactNode } from 'react';

export interface OverlayLabels {
  /** id for the rendered title node (undefined when there's no title). */
  titleId: string | undefined;
  /** id for the rendered description node (undefined when there's no description). */
  descId: string | undefined;
  /** Spread onto the overlay as `aria-labelledby` — points at the title. */
  labelledby: string | undefined;
  /** Spread onto the overlay as `aria-describedby` — points at the description. */
  describedby: string | undefined;
}

/**
 * APG dialog naming for any titled overlay face (Dialog, Drawer, AlertDialog).
 *
 * Each face used to name itself with `aria-label={typeof title === 'string' ? title}` —
 * which silently drops the name for a ReactNode title and never exposes the description.
 * This hook derives stable ids (SSR-safe via `useId`) and the `aria-labelledby` /
 * `aria-describedby` wiring once, so a screen reader announces BOTH the heading and the
 * description on open, the APG-recommended pattern. The face puts `titleId`/`descId` on
 * the rendered `<h2>`/`<p>` and spreads `labelledby`/`describedby` on the overlay.
 *
 * ids are emitted only when the corresponding node is truthy — matching each face's
 * `{title ? <h2/> : null}` render condition — so there are never dangling aria refs.
 */
export function useOverlayLabels(title?: ReactNode, description?: ReactNode): OverlayLabels {
  const base = useId();
  const titleId = title ? `${base}t` : undefined;
  const descId = description ? `${base}d` : undefined;
  return { titleId, descId, labelledby: titleId, describedby: descId };
}
