# Loang's Portfolio

Personal portfolio site for **Pongpat "Loang" Yakhet** — full-stack developer (React / Angular / NestJS / Grails).

## Hero morph

The hero pins for ~3 viewport heights and runs a single GLSL particle system that morphs between three target shapes as the user scrolls:

1. **Photo plane** — flat 2D portrait
2. **Angular shield** — taper-bottom pentagon
3. **React atom** — nucleus + 3 elliptical orbits

A single `uProgress` uniform drives interpolation between target position buffers, with a `sin(local·π)` "burst" displacement at midpoint for a dissolve feel. Subtitle text crossfades through 3 lines via framer-motion. The portrait shows as a static fallback for users with reduced-motion, no-WebGL, or after a runtime FPS downgrade.

## Stack

- **React 19 + TypeScript + Vite**
- **three.js + @react-three/fiber + @react-three/postprocessing** — scene + bloom
- **framer-motion** — section reveals + subtitle crossfade
- **vitest + @testing-library/react** — unit tests
- Custom CSS with token system (no UI lib)

## Performance tiers

`usePerformanceTier` auto-detects from viewport + `navigator.hardwareConcurrency` + `prefers-reduced-motion`:

| Tier             | Particles | Bloom | Trigger |
|------------------|-----------|-------|---------|
| `high`           | 2000      | yes   | desktop, ≥4 cores |
| `medium`         | 1500      | yes   | tablet |
| `low`            | 800       | no    | mobile, low cores |
| `reduced-motion` | 0         | no    | OS preference |

`useFpsDowngrade` watches frame rate; if FPS drops below 30 for 2s straight, the tier downgrades once.

## Scripts

```bash
npm run dev              # vite dev server
npm run build            # tsc + vite build
npm run test             # vitest watch
npm run test:run         # one-shot
npm run assets:portrait  # regenerate webp variants
```

## Layout

```
src/
  components/ui/   Button, Chip, Nav, Reveal, SectionHeading
  content/         profile, projects, timeline, techStack (typed data)
  hooks/           usePerformanceTier, useScrollProgress, useFpsDowngrade, useWebGLSupport
  sections/        Hero, About, TechStack, Projects, Experience, Services, Certificates, Contact
  styles/          theme.css, global.css
  three/           MorphCanvas, ParticleField, targets
```
