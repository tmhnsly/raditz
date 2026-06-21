import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StrictMode } from 'react';
import { render, act } from '@testing-library/react';
import { useInView } from './useInView';

// A controllable IntersectionObserver — unlike the global jsdom mock it does NOT
// auto-fire, so we can assert the observer survives StrictMode's simulated unmount
// (the bug: a useEffect cleanup disconnected the ref-callback-created observer and
// it was never recreated, leaving Reveal stuck hidden).
type Rec = { cb: IntersectionObserverCallback; el?: Element; disconnected: boolean };
let observers: Rec[] = [];

function Probe() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return <div ref={ref} data-inview={inView ? 'yes' : 'no'}>x</div>;
}

describe('useInView', () => {
  beforeEach(() => {
    observers = [];
    (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
      rec: Rec;
      constructor(cb: IntersectionObserverCallback) { this.rec = { cb, disconnected: false }; observers.push(this.rec); }
      observe(el: Element) { this.rec.el = el; }
      disconnect() { this.rec.disconnected = true; }
      unobserve() {}
      takeRecords() { return []; }
    };
  });
  afterEach(() => { delete (globalThis as unknown as { IntersectionObserver?: unknown }).IntersectionObserver; });

  it('keeps a live observer under StrictMode and reveals when it intersects', () => {
    const { container } = render(<StrictMode><Probe /></StrictMode>);
    const live = observers.filter((o) => !o.disconnected);
    expect(live.length).toBeGreaterThan(0); // not disconnected by a simulated unmount
    const o = live[live.length - 1];
    act(() => { o.cb([{ isIntersecting: true, target: o.el } as IntersectionObserverEntry], {} as IntersectionObserver); });
    expect(container.querySelector('[data-inview="yes"]')).toBeTruthy();
  });

  it('reports inView immediately when IntersectionObserver is unavailable (SSR-safe)', () => {
    delete (globalThis as unknown as { IntersectionObserver?: unknown }).IntersectionObserver;
    const { container } = render(<Probe />);
    expect(container.querySelector('[data-inview="yes"]')).toBeTruthy();
  });
});
