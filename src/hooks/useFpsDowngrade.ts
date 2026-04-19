import { useEffect, useState } from 'react';
import type { PerformanceTier } from './usePerformanceTier';

const ORDER: PerformanceTier[] = ['high', 'medium', 'low', 'reduced-motion'];

function downgrade(t: PerformanceTier): PerformanceTier {
  const i = ORDER.indexOf(t);
  return ORDER[Math.min(ORDER.length - 1, i + 1)];
}

/**
 * Monitors frame rate; if FPS stays under threshold for sustained window,
 * returns a downgraded tier (called once — does not bounce back up).
 */
export function useFpsDowngrade(initial: PerformanceTier, threshold = 30, windowMs = 2000): PerformanceTier {
  const [tier, setTier] = useState(initial);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (initial === 'reduced-motion' || initial === 'low') return;

    let raf = 0;
    let last = performance.now();
    let lowStart: number | null = null;
    let cancelled = false;

    const tick = (t: number) => {
      if (cancelled) return;
      const dt = t - last;
      last = t;
      const fps = 1000 / dt;
      if (fps < threshold) {
        if (lowStart === null) lowStart = t;
        else if (t - lowStart >= windowMs) {
          setTier((cur) => downgrade(cur));
          cancelled = true;
          return;
        }
      } else {
        lowStart = null;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [initial, threshold, windowMs]);

  return tier;
}
