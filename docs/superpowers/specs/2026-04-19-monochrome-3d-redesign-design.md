# Monochrome 3D Portfolio Redesign — Design Spec

**Date:** 2026-04-19
**Owner:** Pongpat (Loang)
**Scope:** Replace the warm peach/pink theme with a monochrome editorial theme; add a 3D scroll-pinned TechStack showcase; give every existing section a signature scroll transition; preserve all current content and sections.

---

## 1. Goals

- Replace current warm playful theme with a **monochrome editorial** look (near-black background, off-white ink, single **ice cyan** `#00E6FF` accent).
- Introduce **3D brand icons** (Angular, React, PrimeNG, NestJS, HTML, CSS, SCSS) in a dedicated scroll-pinned showcase.
- Give every section one signature **scroll-driven transition** so the page feels advanced without fighting readability.
- Keep all existing sections, content, and R3F hero morph intact.
- Maintain accessibility: full `prefers-reduced-motion` fallback, keyboard nav, Lighthouse perf ≥ 85 on desktop.

## 2. Non-goals

- Multi-theme support / theme toggle.
- CMS or content restructuring.
- Route/SPA changes beyond the single landing page.
- New backend, analytics, or i18n.

## 3. Visual system

### Palette (CSS custom properties in `src/styles/theme.css`)

| Token | Value | Role |
|---|---|---|
| `--bg` | `#0A0A0A` | Page background |
| `--surface` | `#111111` | Card/panel surfaces |
| `--surface-2` | `#171717` | Elevated surfaces |
| `--ink` | `#F5F5F5` | Primary text |
| `--ink-soft` | `#CFCFCF` | Secondary text |
| `--ink-muted` | `#888888` | Tertiary text / labels |
| `--hairline` | `rgba(245,245,245,0.08)` | Dividers, borders |
| `--accent` | `#00E6FF` | Ice cyan accent |
| `--accent-glow` | `rgba(0,230,255,0.35)` | Glow halos, shadows |

### Typography

- **Display:** Space Grotesk (weights 500, 700) — headings, eyebrows.
- **Body:** Inter (weights 400, 500) — paragraphs.
- **Mono:** JetBrains Mono — labels, tags, code snippets.
- Keep fluid scale from current `theme.css`; retune line-heights for dark background readability.

### Grid & layout

- 12-col Swiss grid, max content width 1280px, generous gutters.
- 1px cyan hairline dividers between sections that **draw left→right** on section entry.
- Large display type, heavy negative space.

### Retired

- `--color-bg-a/b/c`, `--color-accent-pink`, `--color-accent-blue`, `--shadow-offset*`, warm gradient background.

## 4. Motion & transition system

### Scroll engine

- GSAP **ScrollTrigger** + **ScrollSmoother** (already have `gsap` installed; add `gsap/ScrollSmoother` plugin). A single `ScrollSmoother` instance is created in `App.tsx`.
- Lenis is a fallback path only if ScrollSmoother is unavailable in the installed GSAP tier. Default to ScrollSmoother.

### Easing & duration tokens

Added to `theme.css`:

```
--ease-out: cubic-bezier(.22,1,.36,1);
--ease-in-out: cubic-bezier(.76,0,.24,1);
--dur-fast: 240ms;
--dur-med: 520ms;
--dur-slow: 900ms;
```

All CSS transitions and GSAP/framer timelines consume these — no ad-hoc timings.

### Per-section motion

| Section | Motion |
|---|---|
| Hero | Existing particle morph kept; on scroll-out, particles drift downward and dissolve into the next section's hairline divider. |
| About | Mask reveal + line-by-line text fade; portrait tilts on pointer (±6°). |
| TechStack | Scroll-pinned 3D showcase (see §5). |
| Projects | Grid of `TiltCard`s; each tilts in perspective as it crosses viewport; hover amplifies. |
| Experience | Vertical timeline rail with a cyan scrubbing dot tied to scroll progress; past items dim, active item animates in. |
| Services | Cards flip front→back on reveal. |
| Certificates | Cards enter as a stacked deck that fans out. |
| Contact | Fields stagger in; submit button has a 3D press state. |

### Between-section divider

A 1px cyan hairline draws itself left→right as the next section enters, synced with the MaskReveal on that section.

### Reduced motion

`@media (prefers-reduced-motion: reduce)`:
- All GSAP/framer transitions collapse to instant opacity fades (duration 0).
- ScrollSmoother disabled; native scroll only.
- R3F canvases render static (no autorotate, no scroll-driven updates).
- TiltCards render flat (no perspective transforms).

## 5. TechStack 3D showcase (centerpiece)

### Layout

- Section pins for ~700vh of scroll length.
- Left half of viewport: Three.js canvas.
- Right half: text panel showing the active icon's `{ name, category, blurb, usedIn[] }`. Panel contents crossfade as the active index changes.

### Icons (7)

Angular, React, PrimeNG, NestJS, HTML, CSS, SCSS.

- Built as **extruded SVG geometry** using `three-stdlib` `SVGLoader` → `ExtrudeGeometry`. No GLB assets.
- Each icon uses its native brand color as `meshStandardMaterial` emissive at low intensity, plus a cyan rim-light so the scene reads as monochrome with colored focal points.
- SVG sources stored in `src/assets/tech-icons/*.svg` (simple official brand marks).

### Scroll choreography

- 7 equally-spaced snap steps across the pinned range.
- GSAP timeline scrubbed by ScrollTrigger orbits the camera between icon positions.
- Active icon: floats to center, slow Y-axis rotation, emissive intensity up, rim-light brightens.
- Inactive icons: dim, recede to a background ring orbit, reduced scale.

### Idle micro-motion

Each icon has a continuous subtle bob (sin wave, ~2s) and slow rotation so the scene breathes even when scroll is paused.

### Performance

- Single `<Canvas>`; `dpr={[1, 1.8]}`; `frameloop="demand"` — render only when pinned/visible or scroll-scrubbing.
- Lazy-loaded via `React.lazy` + `Suspense`, code-split from the main bundle.
- Geometry built once in a memoized loader; materials shared where possible.

### Fallback (mobile < 768px OR reduced motion)

- No pinning, no scroll-scrub.
- Static CSS grid of the same extruded icons rendered in a small shared canvas (or static SVGs if WebGL unsupported).
- Text panels stack below each icon.

## 6. Architecture

### Kept

- All existing section components (`Hero`, `About`, `TechStack`, `Projects`, `Experience`, `Services`, `Certificates`, `Contact`).
- `components/ui/Nav`, existing R3F hero (`three/MorphCanvas`, `ParticleField`).
- Libraries: `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `three`, `gsap`, `framer-motion`.

### New shared primitives (`src/components/ui/`)

- **`TiltCard.tsx`** — perspective wrapper driven by pointer position + in-view scroll progress. Used by Projects, Services, Certificates.
- **`ScrollScrub.tsx`** — hook `useScrollScrub(ref) → progress 0..1` via ScrollTrigger. Powers TechStack pinning and Experience timeline.
- **`MaskReveal.tsx`** — replaces current `Reveal`; clip-path wipe + translateY with staggered children.
- **`Hairline.tsx`** — the 1px divider that draws left→right on entry.

### New 3D module (`src/three/`)

- **`TechShowcase.tsx`** — the pinned 3D showcase scene, camera rig, and scroll timeline wiring.
- **`icons/`** — one file per tech (`Angular.tsx`, `React.tsx`, `PrimeNG.tsx`, `NestJS.tsx`, `Html.tsx`, `Css.tsx`, `Scss.tsx`). Each exports an R3F group built from an extruded SVG.
- **`icons/useExtrudedSvg.ts`** — shared memoized loader hook.

### Data

`src/content/techStack.ts` extended:

```ts
export interface TechItem {
  name: string;
  slug: 'angular' | 'react' | 'primeng' | 'nestjs' | 'html' | 'css' | 'scss' | string;
  category: 'Frontend' | 'Backend' | 'Language' | 'Tools & Testing';
  color: string;            // brand hex
  svgPath: string;          // imported URL to SVG
  blurb: string;            // one-line description
  usedIn: string[];         // project names
}
```

Non-showcase techs keep the old `{ name, category }` shape; showcase-eligible techs (the 7) add the extra fields.

### Theme switching

CSS custom properties only — `styles/theme.css` is rewritten; section CSS files update their references. No React context, no theme provider.

### App.tsx changes

```
<ScrollSmoother> wrapping existing section tree
<Nav />
<main>
  <Hero />
  <MaskReveal><About /></MaskReveal>
  <MaskReveal><TechStack /></MaskReveal>   // internally uses TechShowcase
  <MaskReveal><Projects /></MaskReveal>
  ...
</main>
```

## 7. Data flow

- Section components stay self-contained; each owns its motion hook(s).
- TechStack reads `techStack` array, filters for `slug`s the showcase supports, passes to `TechShowcase`.
- No new global state.

## 8. Error handling

- R3F canvases wrapped in `ErrorBoundary`; on WebGL failure, render static SVG fallback grid for TechStack and a still image for Hero.
- Font loading: fallback stack (`Space Grotesk → Inter → system-ui`) so first paint is never blocked.
- Reduced-motion and viewport-width guards short-circuit heavy timelines early.

## 9. Testing

- **Vitest + Testing Library:**
  - Each section renders with expected content from `content/*`.
  - `MaskReveal` renders children and applies the reduced-motion class when the media query matches.
  - `TiltCard` applies transform on pointer events and strips it under reduced motion.
  - `techStack` content shape validated (required fields for showcase slugs).
- **R3F:** `@react-three/test-renderer` smoke tests for `TechShowcase` and each icon group.
- **Manual QA checklist:**
  - Desktop Chrome + Firefox + Safari: scroll through every section.
  - Mobile Chrome + Safari: fallback grid renders; no pinning; no jank.
  - `prefers-reduced-motion: reduce` in devtools: all animation collapses.
  - Lighthouse desktop perf ≥ 85; LCP < 2.5s; CLS < 0.1.
  - Keyboard: tab through Nav + Contact form; focus rings visible on cyan.

## 10. Rollout

Single branch, single merge to `main`. No flagging — this is a visual overhaul of a personal site.

## 11. Open questions

None at spec time. Implementation plan will break this into ordered phases (theme tokens → primitives → section transitions → TechShowcase → QA).
