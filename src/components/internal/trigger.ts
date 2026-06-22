'use client';
import { useCallback, useRef } from 'react';
import type { RefObject } from 'react';
import { useControllableState } from './primitiveUtils';

// The Trigger — the open-state driver + anchor wiring every Overlay Adapter face
// needs, factored out of the faces so the controlled/uncontrolled open, the anchor
// ref, and toggle/close stop being copy-pasted. It is deliberately NOT part of
// Overlay: the surface stays separate from what opens it (see CONTEXT.md). Faces
// drive it however they like — click → toggle, hover timers → setOpen, or external
// control via `open` / `onOpenChange`.

export interface TriggerOptions {
  /** Open state (controlled). */
  open?: boolean;
  /** Initial open state (uncontrolled). @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface Trigger<E extends HTMLElement = HTMLElement> {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Flip open/closed — wire to a click trigger. */
  toggle: () => void;
  /** Force closed — wire to Overlay's `onDismiss`. */
  close: () => void;
  /** Ref for the anchor the Overlay positions against (and dismissal ignores). */
  anchorRef: RefObject<E>;
}

export function useTrigger<E extends HTMLElement = HTMLElement>({
  open,
  defaultOpen = false,
  onOpenChange,
}: TriggerOptions): Trigger<E> {
  const [isOpen, setOpen] = useControllableState<boolean>({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
  const anchorRef = useRef<E>(null);
  const toggle = useCallback(() => setOpen((o) => !o), [setOpen]);
  const close = useCallback(() => setOpen(false), [setOpen]);
  return { open: isOpen, setOpen, toggle, close, anchorRef };
}
