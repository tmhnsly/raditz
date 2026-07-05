import type { MutableRefObject, Ref, RefCallback } from 'react';
import { cx } from './cx';

/** Compose several refs into one callback — assigns the node to each. */
export function composeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref && typeof ref === 'object') (ref as MutableRefObject<T | null>).current = node;
    }
  };
}

type Props = Record<string, unknown>;
const isHandler = (key: string): boolean => /^on[A-Z]/.test(key);

/**
 * Merge a component's own props (`base`) with a consumer's overrides (from a
 * `render` element) — the merge behind {@link useRender}. Overrides win on plain
 * props, but the load-bearing ones combine so the design-system behaviour
 * survives an element swap: `className` concatenates, `style` merges (override
 * wins per key), matching event handlers chain (base then override), refs
 * compose, and the base's `children` are kept unless the override provides its
 * own.
 */
export function mergeProps(base: Props, overrides: Props): Props {
  const out: Props = { ...base, ...overrides };

  if (base.className || overrides.className) {
    out.className = cx(base.className as string | undefined, overrides.className as string | undefined);
  }
  if (base.style || overrides.style) {
    out.style = { ...(base.style as object), ...(overrides.style as object) };
  }
  for (const key of Object.keys(overrides)) {
    if (isHandler(key) && typeof overrides[key] === 'function' && typeof base[key] === 'function') {
      const b = base[key] as (...a: unknown[]) => void;
      const o = overrides[key] as (...a: unknown[]) => void;
      out[key] = (...args: unknown[]) => { b(...args); o(...args); };
    }
  }
  if (base.ref || overrides.ref) {
    out.ref = composeRefs(base.ref as Ref<unknown>, overrides.ref as Ref<unknown>);
  }
  if (overrides.children === undefined && base.children !== undefined) {
    out.children = base.children;
  }
  return out;
}
