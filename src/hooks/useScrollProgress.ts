import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

/**
 * Returns scroll progress (0-1) within the given pinned section element.
 * 0 = section just entered viewport top, 1 = section finished scrolling.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = -rect.top;
      const p = Math.min(1, Math.max(0, scrolled / total));
      setProgress(p);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [ref]);

  return progress;
}

/**
 * Maps overall scroll progress (0-1) into a stage index + local progress
 * for an N-stage morph. Returns { stage, localProgress } where stage is
 * the integer index into stage-pairs, localProgress (0-1) interpolates
 * between stage and stage+1.
 */
export function mapToStages(progress: number, stageCount: number): { stage: number; localProgress: number } {
  if (stageCount < 2) return { stage: 0, localProgress: 0 };
  const segments = stageCount - 1;
  const scaled = progress * segments;
  const stage = Math.min(segments - 1, Math.floor(scaled));
  const localProgress = scaled - stage;
  return { stage, localProgress };
}
