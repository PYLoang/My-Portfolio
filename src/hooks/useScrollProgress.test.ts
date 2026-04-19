import { describe, it, expect } from 'vitest';
import { mapToStages } from './useScrollProgress';

describe('mapToStages', () => {
  it('maps 0 progress to stage 0 / localProgress 0', () => {
    expect(mapToStages(0, 3)).toEqual({ stage: 0, localProgress: 0 });
  });
  it('maps 0.5 (middle of 3 stages) to stage 1 / localProgress 0', () => {
    expect(mapToStages(0.5, 3)).toEqual({ stage: 1, localProgress: 0 });
  });
  it('maps 0.25 (3 stages) to stage 0 / localProgress 0.5', () => {
    const r = mapToStages(0.25, 3);
    expect(r.stage).toBe(0);
    expect(r.localProgress).toBeCloseTo(0.5);
  });
  it('clamps progress 1 to stage segments-1 / localProgress 1', () => {
    expect(mapToStages(1, 3)).toEqual({ stage: 1, localProgress: 1 });
  });
  it('handles stageCount < 2 gracefully', () => {
    expect(mapToStages(0.5, 1)).toEqual({ stage: 0, localProgress: 0 });
  });
});
