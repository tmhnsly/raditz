import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOpenState } from './useOpenState';

describe('useOpenState', () => {
  it('uncontrolled: owns the state from defaultOpen and reports changes', () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() => useOpenState({ defaultOpen: false, onOpenChange }));
    expect(result.current.open).toBe(false);

    act(() => result.current.setOpen(true));
    expect(result.current.open).toBe(true);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
  });

  it('defaults to closed when defaultOpen is omitted', () => {
    const { result } = renderHook(() => useOpenState({}));
    expect(result.current.open).toBe(false);
  });

  it('supports functional updaters (toggle)', () => {
    const { result } = renderHook(() => useOpenState({ defaultOpen: true }));
    act(() => result.current.setOpen((o) => !o));
    expect(result.current.open).toBe(false);
    act(() => result.current.setOpen((o) => !o));
    expect(result.current.open).toBe(true);
  });

  it('controlled: mirrors the `open` prop and only reports intent', () => {
    const onOpenChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ open }: { open: boolean }) => useOpenState({ open, onOpenChange }),
      { initialProps: { open: false } },
    );
    expect(result.current.open).toBe(false);

    // setOpen doesn't move controlled state — it only fires onOpenChange.
    act(() => result.current.setOpen(true));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(result.current.open).toBe(false);

    // The owner updating the prop is what changes the state.
    rerender({ open: true });
    expect(result.current.open).toBe(true);
  });

  it('close() sets/reports false', () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() => useOpenState({ defaultOpen: true, onOpenChange }));
    act(() => result.current.close());
    expect(result.current.open).toBe(false);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});
