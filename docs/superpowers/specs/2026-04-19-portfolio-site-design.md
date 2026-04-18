# Portfolio Site — Design Spec

**Date:** 2026-04-19
**Owner:** Pongpat "Loang" Yakhet
**Status:** Approved, ready for implementation plan

## Goal

Build Pongpat's personal portfolio as a single-page site that opens with a centered 2D portrait, then — as the user scrolls — particle-dissolves the photo into a 3D Angular shield, then into a 3D React atom. The rest of the site (about, tech stack, experience, projects, services, certificates, contact) scrolls below, all in a "warm playful" visual style.

## Audience & intent

- Primary: recruiters and hiring managers for full-stack / front-end roles
- Secondary: potential freelance clients (Services section)
- Tone: playful, approachable, confident — not corporate, not hacker-edgy
- Must show: React/Angular fluency, 4 years of real shipped work at Bonmek (8 projects), growth from front-end → full-stack

## Fixed decisions (locked during brainstorming)

| Decision | Choice |
|---|---|
| Visual direction | **Warm Playful** — sunset gradient (cream/peach/pink), bold sans (Inter), friendly geometric shapes, chunky black outlines, offset shadow buttons |
| Hero layout | **Centered Spotlight** — portrait in middle, headline + subtitle below, morph dominates the screen |
| Hero transition | **Particle Dissolve** — photo explodes into ~2000 particles that swarm and reform as Angular shield, then as React atom |
| Project display | **Timeline + filterable grid** — vertical scroll-driven timeline for the "growth story," filterable card grid below for scanning |
| Photo | **2D only** (no 3D scan or faux-depth) — icons are the 3D |
| Backend | **None** — all content in TS data files under `src/content/` |

## Tech stack additions

Existing scaffold: Vite + React 19 + TypeScript.

| Library | Purpose |
|---|---|
| `three` + `@react-three/fiber` + `@react-three/drei` | 3D engine, React bindings, helpers |
| `@react-three/postprocessing` | Bloom on React atom |
| `framer-motion` | DOM section reveals, button micro-interactions |
| `gsap` + `ScrollTrigger` | Authoritative scroll-driven timeline for hero morph |
| `react-router-dom` | Anchor nav; room to grow into real routes later |

## Page structure

Single long-scroll page, sections in order:

1. **Hero** (300vh pinned desktop, 250vh pinned mobile) — photo → Angular → React particle morph
2. **About Me** — bio, born 1999, languages (Thai/English), education (PSU Computer Engineering 2018–2022), hobbies (Technology · Game · Movies)
3. **Tech Stack** — grid of all tech grouped by category (frontend / backend / tools)
4. **Experience Timeline** — vertical scroll-driven timeline, 2021 → 2026, showing intern → front-end → full-stack progression
5. **Projects** — filterable card grid, 8 Bonmek projects, filter chips: *All · Full-Stack · Front-End · Angular · React · NestJS · Grails*
6. **Services** — 2 cards: Web App Development, API Design
7. **Certificates** — Cybersecurity Foundation Course by NCSA (2025)
8. **Contact** — email button (`pongpatyakhet@gmail.com`), GitHub button (`github.com/PYLoang`), Download CV button (wires to existing `src/assets/CV - Loang.pdf`)

## File layout

```
src/
  components/
    hero/
      Hero.tsx              # section wrapper, scroll trigger
      MorphCanvas.tsx       # R3F Canvas, camera, lights
      stages/
        PhotoStage.tsx      # textured plane with portrait, dissolve shader
        AngularStage.tsx    # extruded Angular shield
        ReactStage.tsx      # React atom (3 tori + nucleus)
      ParticleField.tsx     # 2000 particles, custom shader
      HeroText.tsx          # headline (static) + subtitle (crossfades) + CTAs
      ScrollCue.tsx
    sections/
      About.tsx
      TechStack.tsx
      Timeline.tsx
      Projects.tsx
      Services.tsx
      Certificates.tsx
      Contact.tsx
    ui/
      Nav.tsx               # desktop horizontal / mobile hamburger drawer
      Button.tsx            # primary (black fill) + ghost (outlined) variants
      Chip.tsx              # filter chip for Projects
      SectionHeading.tsx
  content/
    profile.ts              # name, role, bio, contact
    projects.ts             # 8 project entries
    timeline.ts             # job/role events, dated
    techStack.ts            # tech list grouped
  hooks/
    useScrollProgress.ts    # 0..1 progress for a pinned section
    usePerformanceTier.ts   # high | medium | low | reduced-motion
  styles/
    theme.css               # warm playful tokens (color, shadow, radius, type scale)
    global.css              # resets + body
  App.tsx                   # composes sections in order
```

**Boundary rationale:** hero owns its own folder because it's ~80% of the implementation risk. Each stage is one file so it can be rendered and debugged in isolation with a fixed `progress` prop. All other sections are DOM-only and flat.

## Hero scroll timeline

Pinned section (300vh desktop / 250vh mobile). Scroll progress drives every animation via GSAP ScrollTrigger — no time-based animation, so scrubbing and scroll-back reverse cleanly.

| Progress | State |
|---|---|
| 0.00 – 0.10 | Photo fully visible, text + CTAs crisp, "scroll to morph ↓" pulses |
| 0.10 – 0.22 | Photo explodes into ~2000 particles, swarming outward |
| 0.22 – 0.33 | Particles swarm inward to Angular shield shape |
| 0.33 – 0.40 | Particles snap into solid 3D Angular mesh, mesh rotates 20° |
| 0.40 – 0.50 | Angular holds, subtitle updates, Angular label fades in |
| 0.50 – 0.62 | Angular re-explodes into particles (red → cyan mid-flight) |
| 0.62 – 0.73 | Particles swarm inward to React atom |
| 0.73 – 0.80 | Particles resolve into 3D React atom (3 rotating tori + glowing nucleus with bloom) |
| 0.80 – 1.00 | React atom orbits slowly, subtitle updates, "continue scrolling ↓" |

After 100%, hero unpins. Scrolling back up reverses everything — no re-trigger on re-entry.

## Subtitle crossfade (alongside morph)

Headline stays constant (`Pongpat Yakhet`). Subtitle changes at the stage boundaries:

- **0.00 – 0.40**: *"Full-stack dev — Angular, React, NestJS, Grails. 4 years building real things."*
- **0.40 – 0.62**: *"I build Angular apps that ship to production — 8 projects at Bonmek and counting."*
- **0.62 – 1.00**: *"Also fluent in React — modern SPAs with NestJS + TypeORM backends."*

## 3D stages — how they're built

**PhotoStage:** flat plane, portrait as texture, `ShaderMaterial` with a `dissolve` uniform. Shader reads the particle field and discards pixels that have been "claimed" by a particle. Result: genuine disintegration, not fade.

**AngularStage:** `ExtrudeGeometry` from the Angular shield SVG path. `MeshPhysicalMaterial` in `#dd0031` with clearcoat and slight metalness — reads as enamel badge under warm scene lighting.

**ReactStage:** three `TorusGeometry` rings, each rotated 60° on a different axis, parented to a group that slowly rotates. Cyan emissive material (`#61dafb`) with bloom in post. Nucleus is a small `IcosahedronGeometry`.

## ParticleField

Single `Points` mesh, 2000 particles (800 on mobile), custom shader. Each particle has:

- `targetA` — position on photo surface (sampled from portrait image)
- `targetB` — position on Angular shield surface
- `targetC` — position on React atom surface
- `hueA / hueB / hueC` — color sampled from each source object

A `progress` uniform (driven by ScrollTrigger) blends between targets. In the "exploded" phase, particles lerp toward randomized positions beyond either target to create the swarm feel. No per-particle JS loop — it's all in the shader.

## Performance tiers (auto-detected)

| Tier | Trigger | Particles | Bloom | Shadows |
|---|---|---|---|---|
| High | Desktop, HW concurrency ≥ 4 | 2000 | Yes | Soft |
| Medium | Tablet, or desktop w/ low HW concurrency | 1500 | Reduced | Hard |
| Low | Mobile | 800 | No | No |
| Reduced-motion | `prefers-reduced-motion: reduce` anywhere | 0 (static fades) | No | No |

Detection at mount time via `usePerformanceTier` — based on `window.innerWidth`, `window.devicePixelRatio`, `navigator.hardwareConcurrency`, and `matchMedia('(prefers-reduced-motion: reduce)')`.

Runtime downgrade: if measured FPS < 30 for 2 consecutive seconds, drop one tier.

## Responsive design

Three breakpoints, mobile-first, using CSS custom properties + `clamp()` for fluid scaling between them.

| Breakpoint | Width |
|---|---|
| Mobile | `< 768px` |
| Tablet | `768–1024px` |
| Desktop | `> 1024px` |

### Per-section responsive behavior

- **Hero**: desktop 300vh pinned with ~320px photo; tablet 300vh, ~220px photo; mobile 250vh pinned, ~160px photo, headline via `clamp(32px, 8vw, 64px)`, CTAs stack full-width. Touch devices disable pointer-move particle interactions.
- **Nav**: desktop/tablet horizontal anchor links; mobile hamburger → full-screen warm-gradient drawer, 48px min tap targets.
- **Tech Stack**: desktop 5 cols, tablet 3 cols, mobile 2 cols (no hover states).
- **Timeline**: desktop/tablet two-sided alternating; mobile collapses to single-sided left (center line at left edge).
- **Projects**: desktop 3 cols, tablet 2 cols, mobile 1 col. Filter chips: desktop/tablet row; mobile horizontally scrollable with `scroll-snap`.
- **Contact**: desktop/tablet 3 side-by-side buttons; mobile stacked full-width.

## Fallbacks & edge cases

- **`prefers-reduced-motion`**: skip particle dissolve entirely, hero shows 3-part carousel (photo → Angular → React) with 1s fades triggered by scroll.
- **No WebGL / WebGL init fails**: render static photo + text + CTAs, no morph. Detected via try/catch around Canvas creation.
- **Low FPS at runtime**: auto-downgrade one tier after 2 seconds of < 30fps.
- **JS disabled**: static markup in `index.html` renders photo, headline, subtitle, and CTAs — page is readable.

## Image & asset strategy

- Hero portrait: export at 320/640/1280 WebP, served via `<picture>` + `srcset`
- Project card graphics: auto-generated SVG (geometric, warm-playful palette) — same file scales freely
- CV PDF: loaded on click only (never prefetched, 222 KB)
- Fonts: Inter (body), Georgia fallback for serif accents, preloaded

## Performance targets

- Lighthouse Performance: ≥ 85 desktop, ≥ 75 mobile
- First Contentful Paint < 1.8s
- Total JS bundle (gzipped) < 400 KB
- Hero: 60fps on 2020-era MacBook Pro, 30fps minimum on 2021 mid-range Android

## Testing checklist (must pass before "done")

- Chrome + Safari on macOS (1440×900)
- Safari on iPad (1024×1366, both orientations)
- Chrome on Android (390×844)
- Safari on iPhone (390×844)
- `prefers-reduced-motion: reduce` enabled
- DevTools "CPU 4× slowdown" + "Fast 3G" — still usable
- Keyboard-only nav (Tab through nav + skip-to-main link)
- WebGL disabled (fallback renders correctly)

## Real content (from CV + user)

**Profile:** Pongpat Yakhet, nickname Loang. Born 1999-05-27. Based in Hat Yai, Songkhla. Full-Stack Developer, ~4 years at Bonmek Co. Ltd.

**Contact:** pongpatyakhet@gmail.com · github.com/PYLoang · CV at `src/assets/CV - Loang.pdf`

**Education:** Prince of Songkla University — Computer Engineering (2018–2022); Hatyaiwittayalaisomboonkulkanya School (2011–2017).

**Certificate:** Cybersecurity Foundation Course by NCSA (2025).

**Hobbies:** Technology, Games, Movies.

**Languages:** Thai, English.

**Work history (all Bonmek Co. Ltd., Hat Yai):**

| Dates | Project | Role | Stack |
|---|---|---|---|
| 2021–2022 | Internship | Automate Test intern | Cypress.io, JS, testing Angular + Electron |
| 2021–2022 | ATM (Legal & Litigation) | Front-End + UX/UI | Angular / Grails |
| 2022–2023 | Just (Shopping Online) | Front-End + UX/UI | Angular / Grails |
| 2022–2023 | DBMR (Stock & Produce Products) | Front-End + UX/UI | Angular / Grails |
| 2023–2024 | Barbie (Clinic Management System) | Front-End + UX/UI | Angular / Grails |
| 2023–2024 | TMS (Transport Management System) | Full-Stack + UX/UI | Angular / Grails |
| 2024–2025 | VJF (Online Job Finder) | Full-Stack + UX/UI | Angular / Grails |
| 2025–present | ODS (Online Documents) | Full-Stack | Angular / NestJS + TypeORM |
| 2026–present | PP-SA (Stock & Personnel Management) | Full-Stack | Angular / NestJS + TypeORM |

**Services offered:** Web App Development, API Design.

## Out of scope (explicit)

- Custom cursor
- Page transitions (single-page anchor nav)
- i18n / Thai-English switcher (English only v1)
- Blog / CMS
- Analytics
- Dark mode toggle
- Sound effects
- Contact form (mailto: link is sufficient)

## Open questions / deferred decisions

- Real portrait photo asset is not yet in `src/assets/` (current `hero.png` is placeholder). User to provide final portrait before launch; implementation can proceed against the placeholder.
- Project card graphics are auto-generated SVG for v1. User may swap in real screenshots later by replacing one image path per card in `src/content/projects.ts`.

## Success criteria

- User can scroll from top to bottom on desktop, iPad, and phone with no visible jank or layout breaks
- Hero morph reads clearly as "photo → Angular → React" to a first-time viewer (user-test informally with 1–2 people)
- All 8 Bonmek projects render correctly in the grid with working filters
- Download CV button delivers the actual PDF
- Lighthouse Performance ≥ 85 on desktop
- Keyboard-only user can reach every interactive element
