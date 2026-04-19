import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateTargets, TARGET_COLORS } from './targets';

const vertexShader = /* glsl */ `
  attribute vec3 aPhoto;
  attribute vec3 aAngular;
  attribute vec3 aReact;
  attribute vec3 aRandom;
  attribute float aSeed;

  uniform float uProgress;     // 0..1 across full hero scroll
  uniform float uTime;
  uniform float uSize;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying vec3 vColor;
  varying float vAlpha;

  // Smooth blend between photo (0..0.5) and angular (0.5..) and react (..1.0)
  void main() {
    float p = clamp(uProgress, 0.0, 1.0);

    // Two segments: 0..0.5 photo->angular ; 0.5..1.0 angular->react
    vec3 from, to;
    vec3 fromColor, toColor;
    float local;
    if (p < 0.5) {
      from = aPhoto; to = aAngular;
      fromColor = uColorA; toColor = uColorB;
      local = p / 0.5;
    } else {
      from = aAngular; to = aReact;
      fromColor = uColorB; toColor = uColorC;
      local = (p - 0.5) / 0.5;
    }

    // Dissolve: in middle of segment, push particle out toward random burst
    float dissolve = sin(local * 3.14159) * 0.6;
    vec3 burst = aRandom * dissolve * (0.4 + 0.6 * aSeed);

    // Ease the local progress for snappier morph
    float eased = smoothstep(0.0, 1.0, local);
    vec3 pos = mix(from, to, eased) + burst;

    // Gentle idle wobble
    pos += 0.015 * vec3(
      sin(uTime * 0.7 + aSeed * 6.28),
      cos(uTime * 0.6 + aSeed * 6.28),
      sin(uTime * 0.5 + aSeed * 6.28)
    );

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (1.0 + 0.6 * aSeed) * (300.0 / -mv.z);

    vColor = mix(fromColor, toColor, eased);
    // Fade slightly during dissolve peak so morph reads as crossfade
    vAlpha = 1.0 - dissolve * 0.4;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.2, d);
    gl_FragColor = vec4(vColor, soft * vAlpha);
  }
`;

interface Props {
  count: number;
  progress: number;
}

export function ParticleField({ count, progress }: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const targetsRef = useRef<ReturnType<typeof generateTargets> | null>(null);

  const { geometry, uniforms } = useMemo(() => {
    const targets = generateTargets(count);
    targetsRef.current = targets;

    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) seeds[i] = Math.random();

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(targets.photo.slice(), 3));
    geo.setAttribute('aPhoto', new THREE.BufferAttribute(targets.photo, 3));
    geo.setAttribute('aAngular', new THREE.BufferAttribute(targets.angular, 3));
    geo.setAttribute('aReact', new THREE.BufferAttribute(targets.react, 3));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(targets.random, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

    const u = {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 14 },
      uColorA: { value: TARGET_COLORS.photo },
      uColorB: { value: TARGET_COLORS.angular },
      uColorC: { value: TARGET_COLORS.react },
    };

    return { geometry: geo, uniforms: u };
  }, [count]);

  useFrame((_, dt) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value += dt;
    // Damp progress toward target for buttery interpolation
    const cur = matRef.current.uniforms.uProgress.value as number;
    matRef.current.uniforms.uProgress.value = cur + (progress - cur) * 0.15;
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
