'use client';
import { useCallback, useState } from 'react';

/**
 * useReplay — the remount-to-replay primitive. Spread the returned `key` onto the
 * subtree whose entrance you want to re-fire; calling `replay()` bumps it so React
 * remounts that subtree, re-running any mount-time / scroll-reveal / one-shot CSS
 * animation. The same trick `AnimationsA` and `Vignette`/`Spotlight` hand-rolled,
 * factored out so the Storybook Replay decorator and any section can share it.
 */
export function useReplay(): { key: number; replay: () => void } {
  const [key, setKey] = useState(0);
  const replay = useCallback(() => setKey((k) => k + 1), []);
  return { key, replay };
}
