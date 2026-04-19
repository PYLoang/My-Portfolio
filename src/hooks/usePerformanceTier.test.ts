import { describe, it, expect } from 'vitest';
import { computeTier } from './usePerformanceTier';

describe('computeTier', () => {
  it('returns reduced-motion when prefers-reduced-motion is set', () => {
    expect(computeTier({ width: 1920, cores: 8, reducedMotion: true })).toBe('reduced-motion');
  });
  it('returns low on mobile width', () => {
    expect(computeTier({ width: 400, cores: 8, reducedMotion: false })).toBe('low');
  });
  it('returns medium on tablet width', () => {
    expect(computeTier({ width: 900, cores: 8, reducedMotion: false })).toBe('medium');
  });
  it('returns medium on desktop with low core count', () => {
    expect(computeTier({ width: 1400, cores: 2, reducedMotion: false })).toBe('medium');
  });
  it('returns high on desktop with sufficient cores', () => {
    expect(computeTier({ width: 1400, cores: 8, reducedMotion: false })).toBe('high');
  });
});
