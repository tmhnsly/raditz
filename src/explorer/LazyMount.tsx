import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * Renders its children only once it scrolls near the viewport, so a big page of
 * components doesn't mount everything at once. Reserves `minHeight` until mounted
 * to keep scroll position stable, and stays mounted thereafter.
 */
export function LazyMount({ children, minHeight = 200 }: { children: ReactNode; minHeight?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) { setShown(true); io.disconnect(); } },
      { rootMargin: '400px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  return (
    <div ref={ref} style={shown ? undefined : { minHeight }}>
      {shown ? children : null}
    </div>
  );
}
