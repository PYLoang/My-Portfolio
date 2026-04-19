import { useEffect, useState } from 'react';

export type PerformanceTier = 'high' | 'medium' | 'low' | 'reduced-motion';

export interface TierInput {
  width: number;
  cores: number;
  reducedMotion: boolean;
}

export function computeTier({ width, cores, reducedMotion }: TierInput): PerformanceTier {
  if (reducedMotion) return 'reduced-motion';
  if (width < 768) return 'low';
  if (width < 1024) return 'medium';
  if (cores < 4) return 'medium';
  return 'high';
}

export function usePerformanceTier(): PerformanceTier {
  const [tier, setTier] = useState<PerformanceTier>('medium');

  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const recompute = () => {
      setTier(computeTier({
        width: window.innerWidth,
        cores: navigator.hardwareConcurrency ?? 4,
        reducedMotion: mq.matches,
      }));
    };
    recompute();
    window.addEventListener('resize', recompute);
    mq.addEventListener('change', recompute);
    return () => {
      window.removeEventListener('resize', recompute);
      mq.removeEventListener('change', recompute);
    };
  }, []);

  return tier;
}

export const TIER_CONFIG: Record<PerformanceTier, { particles: number; bloom: boolean; shadows: 'soft' | 'hard' | 'none' }> = {
  high: { particles: 2000, bloom: true, shadows: 'soft' },
  medium: { particles: 1500, bloom: true, shadows: 'hard' },
  low: { particles: 800, bloom: false, shadows: 'none' },
  'reduced-motion': { particles: 0, bloom: false, shadows: 'none' },
};
