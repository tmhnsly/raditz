'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Reset scroll to the top on every route change. Applied once in the layout so no
 * page has to remember it. Skips in-page anchor jumps (e.g. /services#courses),
 * which should land on their target rather than the top.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
