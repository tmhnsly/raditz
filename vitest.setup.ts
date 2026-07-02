// jsdom polyfills for APIs some components use (overlays, charts, media).
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => cleanup());

// @testing-library/react's asyncWrapper drains the microtask queue with a
// `setTimeout(0)` and only auto-advances fake timers via a `jest` global. Under
// `vi.useFakeTimers()` (no `jest` global) every awaited userEvent call would
// hang forever. Shim the one API RTL calls; it's a no-op with real timers.
(globalThis as { jest?: unknown }).jest = {
  advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms),
};

if (!('ResizeObserver' in globalThis)) {
  (globalThis as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

if (!('matchMedia' in window)) {
  (window as any).matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() {
      return false;
    },
  });
}

if (!('scrollTo' in window)) {
  (window as any).scrollTo = () => {};
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// jsdom has no IntersectionObserver. Fire once as "intersecting" so lazy content
// mounts and scroll-spy resolves during tests.
if (!('IntersectionObserver' in globalThis)) {
  (globalThis as any).IntersectionObserver = class {
    cb: (entries: unknown[], obs: unknown) => void;
    constructor(cb: (entries: unknown[], obs: unknown) => void) { this.cb = cb; }
    observe(el: Element) {
      this.cb([{ isIntersecting: true, target: el, boundingClientRect: { top: 0 } }], this);
    }
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  };
}
