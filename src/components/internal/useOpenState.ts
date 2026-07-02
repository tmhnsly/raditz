'use client';
import { useCallback } from 'react';
import { useControllableState } from './primitiveUtils';

// The modal open-state shim: every overlay face exposes the same trio of props
// (`open` / `defaultOpen` / `onOpenChange`) and wires it to useControllableState
// with the same line. This hook pins that DS naming convention in ONE tested
// place — it adds no behaviour beyond the `close` helper the faces also repeat.

export interface OpenStateOptions {
  /** Open state (controlled). */
  open?: boolean;
  /** Initial open state (uncontrolled). @default false */
  defaultOpen?: boolean;
  /** Fires with the next open state on every change (controlled or not). */
  onOpenChange?: (open: boolean) => void;
}

export interface OpenState {
  open: boolean;
  /** Set the open state (accepts a functional updater, like setState). */
  setOpen: (next: boolean | ((prev: boolean) => boolean)) => void;
  /** Force closed — wire to an Overlay's `onDismiss` / a close button. */
  close: () => void;
}

/**
 * useOpenState — a thin, documented **naming shim** over
 * {@link useControllableState} that maps the DS's modal open-state convention
 * (`open` / `defaultOpen` / `onOpenChange`) onto its generic shape
 * (`value` / `defaultValue` / `onChange`), plus the `close` helper every face
 * repeated. Nothing more: faces whose open state isn't a boolean (Menubar's
 * open menu *index*) stay hand-wired on useControllableState. For triggers that
 * also need an anchor ref + toggle, use `useTrigger` (which composes this).
 */
export function useOpenState({ open, defaultOpen = false, onOpenChange }: OpenStateOptions): OpenState {
  const [isOpen, setOpen] = useControllableState<boolean>({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
  const close = useCallback(() => setOpen(false), [setOpen]);
  return { open: isOpen, setOpen, close };
}
