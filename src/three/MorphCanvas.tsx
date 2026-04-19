import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ParticleField } from './ParticleField';
import { TIER_CONFIG } from '../hooks/usePerformanceTier';
import type { PerformanceTier } from '../hooks/usePerformanceTier';

interface Props {
  progress: number;
  tier: PerformanceTier;
}

export function MorphCanvas({ progress, tier }: Props) {
  const config = TIER_CONFIG[tier];

  if (config.particles === 0) return null;

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3.2], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.6} />
      <ParticleField count={config.particles} progress={progress} />
      {config.bloom && (
        <EffectComposer>
          <Bloom intensity={0.6} luminanceThreshold={0.2} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  );
}
