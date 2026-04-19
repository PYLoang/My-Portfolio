import * as THREE from 'three';

/**
 * Generate 3 parallel Float32 buffers holding (x,y,z) positions for each
 * of 3 targets: a flat photo plane, an Angular shield, and a React atom.
 * All three buffers share the same length (count * 3) so the shader can
 * index into them with the same vertex id.
 */
export function generateTargets(count: number): {
  photo: Float32Array;
  angular: Float32Array;
  react: Float32Array;
  random: Float32Array;
} {
  const photo = new Float32Array(count * 3);
  const angular = new Float32Array(count * 3);
  const react = new Float32Array(count * 3);
  const random = new Float32Array(count * 3);

  const seed = (i: number) => Math.sin(i * 12.9898) * 43758.5453 % 1;

  for (let i = 0; i < count; i++) {
    const idx = i * 3;

    // Photo — uniform square 2×2 plane on z=0, slight jitter on z
    const px = (seed(i) - 0.5) * 2;
    const py = (seed(i + 1000) - 0.5) * 2;
    photo[idx] = px;
    photo[idx + 1] = py;
    photo[idx + 2] = (seed(i + 2000) - 0.5) * 0.05;

    // Angular — shield shape. Points distributed in a rounded pentagonal shield silhouette.
    const t = i / count;
    const ang = t * Math.PI * 2;
    const shieldR = 0.85 + Math.cos(ang * 2.5) * 0.05;
    // Taper to a point at the bottom: squash Y-negative side.
    const nx = Math.sin(ang) * shieldR;
    const ny = Math.cos(ang) * shieldR;
    const taper = ny < 0 ? 1 - Math.abs(ny) * 0.5 : 1;
    // Sample either boundary or interior.
    const r = Math.sqrt(seed(i + 3000));
    angular[idx] = nx * r * taper;
    angular[idx + 1] = ny * r - (r < 0.3 ? 0.2 : 0);
    angular[idx + 2] = (seed(i + 4000) - 0.5) * 0.1;

    // React — atom: central nucleus + 3 elliptical orbit rings at 60° apart
    const mode = i % 4;
    if (mode === 0) {
      // Nucleus
      const nr = seed(i + 5000) * 0.15;
      const th = seed(i + 6000) * Math.PI * 2;
      const ph = seed(i + 7000) * Math.PI;
      react[idx] = nr * Math.sin(ph) * Math.cos(th);
      react[idx + 1] = nr * Math.sin(ph) * Math.sin(th);
      react[idx + 2] = nr * Math.cos(ph);
    } else {
      // Orbit rings
      const ringIdx = mode - 1;
      const tiltAngle = (ringIdx * Math.PI) / 3;
      const orbitT = seed(i + 8000 + ringIdx * 100) * Math.PI * 2;
      const a = 1.1, b = 0.42;
      const rx = Math.cos(orbitT) * a;
      const ry = Math.sin(orbitT) * b;
      // Rotate around Z by tiltAngle
      react[idx] = rx * Math.cos(tiltAngle) - ry * Math.sin(tiltAngle);
      react[idx + 1] = rx * Math.sin(tiltAngle) + ry * Math.cos(tiltAngle);
      react[idx + 2] = (seed(i + 9000) - 0.5) * 0.05;
    }

    // Random burst positions for the "dissolve" middle frames
    const rr = 1.6 + seed(i + 10000) * 0.8;
    const rth = seed(i + 11000) * Math.PI * 2;
    const rph = Math.acos(2 * seed(i + 12000) - 1);
    random[idx] = rr * Math.sin(rph) * Math.cos(rth);
    random[idx + 1] = rr * Math.sin(rph) * Math.sin(rth);
    random[idx + 2] = rr * Math.cos(rph);
  }

  return { photo, angular, react, random };
}

/** Pick color for a target index (0=photo warm, 1=angular red, 2=react cyan). */
export const TARGET_COLORS = {
  photo: new THREE.Color('#ff8a8a'),
  angular: new THREE.Color('#dd0031'),
  react: new THREE.Color('#61dafb'),
};
