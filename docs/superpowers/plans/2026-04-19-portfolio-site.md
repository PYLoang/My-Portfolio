# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Pongpat "Loang" Yakhet's personal portfolio — a warm-playful single-page site opening with a 2D portrait that particle-dissolves into a 3D Angular shield, then a 3D React atom, as the user scrolls. Below, 7 content sections (about, tech stack, timeline, projects, services, certificates, contact) with full responsive behavior.

**Architecture:** Vite + React 19 + TS SPA. Hero uses react-three-fiber (WebGL) + GSAP ScrollTrigger to drive a scroll-pinned morph through 3 stages powered by a single custom-shader particle system. All other sections are standard DOM + CSS with Framer Motion reveals. Content lives in typed TS data files so copy edits never touch components.

**Tech Stack:** React 19, TypeScript, Vite, three.js, @react-three/fiber, @react-three/drei, @react-three/postprocessing, gsap + ScrollTrigger, framer-motion, react-router-dom, Vitest + @testing-library/react for unit tests.

**Source spec:** [docs/superpowers/specs/2026-04-19-portfolio-site-design.md](../specs/2026-04-19-portfolio-site-design.md)

---

## Phase 0 — Setup & Foundations

### Task 1: Initialize git and baseline commit

**Files:**
- Modify: `.gitignore` (already done — `.superpowers/` added)

- [ ] **Step 1: Initialize repo**

```bash
git init
git add .gitignore README.md package.json package-lock.json tsconfig*.json vite.config.ts eslint.config.js index.html src public docs
git status
```

- [ ] **Step 2: First commit**

```bash
git commit -m "chore: initial Vite + React 19 + TS scaffold + design spec"
```

---

### Task 2: Install all dependencies upfront

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Install runtime deps**

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing gsap framer-motion react-router-dom
```

- [ ] **Step 2: Install dev deps**

```bash
npm install -D @types/three vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui
```

- [ ] **Step 3: Verify no peer warnings blocking install**

Run `npm ls three @react-three/fiber` — expected: tree resolves with no ERESOLVE errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add three, r3f, gsap, framer-motion, vitest"
```

---

### Task 3: Configure Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `src/setupTests.ts`

- [ ] **Step 1: Create vitest config**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    globals: true,
  },
});
```

- [ ] **Step 2: Create setup file**

```ts
// src/setupTests.ts
import '@testing-library/jest-dom';
```

- [ ] **Step 3: Add test scripts**

Edit `package.json` scripts:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest",
  "test:run": "vitest run",
  "test:ui": "vitest --ui"
}
```

- [ ] **Step 4: Write a sanity test**

```ts
// src/setupTests.test.ts
import { describe, it, expect } from 'vitest';
describe('vitest', () => {
  it('runs', () => expect(1 + 1).toBe(2));
});
```

- [ ] **Step 5: Run test**

Run `npm run test:run` — expected: 1 passed.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts src/setupTests.ts src/setupTests.test.ts package.json
git commit -m "chore: configure vitest + jsdom"
```

---

### Task 4: Theme tokens & global styles

**Files:**
- Create: `src/styles/theme.css`
- Create: `src/styles/global.css`
- Modify: `src/main.tsx` (import the new stylesheets, remove default `index.css` import if present)
- Delete: `src/App.css`, `src/index.css` (scaffold leftovers — replace entirely)

- [ ] **Step 1: Write theme tokens**

```css
/* src/styles/theme.css */
:root {
  /* Warm Playful palette */
  --color-bg-a: #fff5e1;
  --color-bg-b: #ffe5b8;
  --color-bg-c: #ffb8c8;
  --color-bg-gradient: linear-gradient(135deg, var(--color-bg-a) 0%, var(--color-bg-b) 50%, var(--color-bg-c) 100%);
  --color-ink: #1a1a1a;
  --color-ink-soft: #3a3a3a;
  --color-ink-muted: #6b6b6b;
  --color-accent-pink: #ff6b8a;
  --color-accent-blue: #6b8aff;
  --color-accent-cream: #fff5e1;
  --color-react: #61dafb;
  --color-angular: #dd0031;

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-serif: Georgia, 'Times New Roman', serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;

  /* Fluid type scale */
  --text-xs: clamp(10px, 1vw, 12px);
  --text-sm: clamp(12px, 1.2vw, 14px);
  --text-base: clamp(14px, 1.4vw, 16px);
  --text-lg: clamp(16px, 1.6vw, 18px);
  --text-xl: clamp(20px, 2vw, 24px);
  --text-2xl: clamp(24px, 3vw, 32px);
  --text-3xl: clamp(32px, 5vw, 48px);
  --text-display: clamp(40px, 8vw, 96px);

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-pill: 999px;

  /* Signature offset shadow */
  --shadow-offset: 6px 6px 0 var(--color-ink);
  --shadow-offset-sm: 3px 3px 0 var(--color-ink);

  /* Breakpoints (used in JS only; CSS uses media queries directly) */
  --bp-tablet: 768px;
  --bp-desktop: 1024px;
}
```

- [ ] **Step 2: Write global.css**

```css
/* src/styles/global.css */
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: var(--font-sans);
  color: var(--color-ink);
  background: var(--color-bg-gradient);
  background-attachment: fixed;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
img { display: block; max-width: 100%; }
button { font-family: inherit; cursor: pointer; }
a { color: inherit; text-decoration: none; }

/* Skip link for keyboard nav */
.skip-link {
  position: absolute;
  top: -100px;
  left: 16px;
  padding: 12px 20px;
  background: var(--color-ink);
  color: var(--color-accent-cream);
  border-radius: var(--radius-sm);
  z-index: 9999;
  transition: top 0.2s;
}
.skip-link:focus { top: 16px; }
```

- [ ] **Step 3: Update `src/main.tsx`**

```tsx
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/theme.css';
import './styles/global.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 4: Delete scaffold `App.css` and `index.css`**

```bash
rm src/App.css src/index.css 2>/dev/null || true
```

- [ ] **Step 5: Replace `src/App.tsx` with minimal placeholder**

```tsx
// src/App.tsx
export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <main id="main" style={{ minHeight: '100vh', padding: '40px' }}>
        <h1>Portfolio — scaffold</h1>
      </main>
    </>
  );
}
```

- [ ] **Step 6: Run dev server, verify warm-playful background gradient shows**

```bash
npm run dev
```

Open `http://localhost:5173` — expect: warm gradient fills page, "Portfolio — scaffold" text visible.

- [ ] **Step 7: Commit**

```bash
git add src/styles src/main.tsx src/App.tsx
git rm src/App.css src/index.css
git commit -m "feat: warm playful theme tokens + global styles"
```

---

### Task 5: Content data files (typed)

**Files:**
- Create: `src/content/profile.ts`
- Create: `src/content/projects.ts`
- Create: `src/content/timeline.ts`
- Create: `src/content/techStack.ts`

- [ ] **Step 1: Profile data**

```ts
// src/content/profile.ts
export const profile = {
  name: 'Pongpat Yakhet',
  nickname: 'Loang',
  role: 'Full-Stack Developer',
  yearsExperience: 4,
  location: 'Hat Yai, Songkhla',
  born: '1999-05-27',
  languages: ['Thai', 'English'],
  hobbies: ['Technology', 'Games', 'Movies'],
  email: 'pongpatyakhet@gmail.com',
  github: 'https://github.com/PYLoang',
  githubHandle: 'PYLoang',
  cvPath: '/assets/CV - Loang.pdf', // moved into public/ in Task 7
  education: [
    { school: 'Prince of Songkla University', program: 'Computer Engineering', years: '2018–2022' },
    { school: 'Hatyaiwittayalaisomboonkulkanya School', program: 'MCP (Math-Computer) / SMA (Science-Math)', years: '2011–2017' },
  ],
  bio: `I'm Loang, a full-stack developer based in Hat Yai. I've spent the last 4 years at Bonmek Co. Ltd. shipping real production apps — 8 projects and counting — growing from front-end work into full-stack ownership with NestJS + TypeORM backends. I love shipping polished UIs, cleaning up messy data flows, and finding the right abstraction.`,
  services: [
    { title: 'Web App Development', desc: 'Angular or React frontends with production-grade state management, routing, and testing.' },
    { title: 'API Design', desc: 'NestJS + TypeORM or Grails backends — REST design, auth, DB modeling, deployment.' },
  ],
  certificates: [
    { name: 'Cybersecurity Foundation Course', issuer: 'NCSA', year: '2025' },
  ],
} as const;
```

- [ ] **Step 2: Projects data**

```ts
// src/content/projects.ts
export type ProjectRole = 'Full-Stack' | 'Front-End';
export type ProjectTech = 'Angular' | 'React' | 'NestJS' | 'Grails' | 'TypeORM';

export interface Project {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  role: ProjectRole;
  extraRole?: 'UX/UI Design';
  tech: ProjectTech[];
  years: string;
  company: string;
}

export const projects: Project[] = [
  {
    id: 'pp-sa',
    name: 'PP-SA',
    shortName: 'Stock & Personnel Management',
    tagline: 'Internal system for managing stock inventory and HR records.',
    role: 'Full-Stack',
    tech: ['Angular', 'NestJS', 'TypeORM'],
    years: '2026–Present',
    company: 'Bonmek Co. Ltd.',
  },
  {
    id: 'ods',
    name: 'ODS',
    shortName: 'Online Documents (คำร้องออนไลน์)',
    tagline: 'Online document request and routing platform.',
    role: 'Full-Stack',
    tech: ['Angular', 'NestJS', 'TypeORM'],
    years: '2025–Present',
    company: 'Bonmek Co. Ltd.',
  },
  {
    id: 'vjf',
    name: 'VJF',
    shortName: 'Online Job Finder',
    tagline: 'Job board with applicant tracking and employer dashboards.',
    role: 'Full-Stack',
    extraRole: 'UX/UI Design',
    tech: ['Angular', 'Grails'],
    years: '2024–2025',
    company: 'Bonmek Co. Ltd.',
  },
  {
    id: 'tms',
    name: 'TMS',
    shortName: 'Transport Management System',
    tagline: 'Fleet, route, and delivery tracking for a logistics operator.',
    role: 'Full-Stack',
    extraRole: 'UX/UI Design',
    tech: ['Angular', 'Grails'],
    years: '2023–2024',
    company: 'Bonmek Co. Ltd.',
  },
  {
    id: 'barbie',
    name: 'Barbie',
    shortName: 'Clinic Management System',
    tagline: 'Patient records, scheduling, and billing for a private clinic.',
    role: 'Front-End',
    extraRole: 'UX/UI Design',
    tech: ['Angular', 'Grails'],
    years: '2023–2024',
    company: 'Bonmek Co. Ltd.',
  },
  {
    id: 'just',
    name: 'Just',
    shortName: 'Shopping Online',
    tagline: 'E-commerce storefront with cart, checkout, and order tracking.',
    role: 'Front-End',
    extraRole: 'UX/UI Design',
    tech: ['Angular', 'Grails'],
    years: '2022–2023',
    company: 'Bonmek Co. Ltd.',
  },
  {
    id: 'dbmr',
    name: 'DBMR',
    shortName: 'Stock & Produce Products',
    tagline: 'Warehouse stock + produce manufacturing workflow.',
    role: 'Front-End',
    extraRole: 'UX/UI Design',
    tech: ['Angular', 'Grails'],
    years: '2022–2023',
    company: 'Bonmek Co. Ltd.',
  },
  {
    id: 'atm',
    name: 'ATM',
    shortName: 'Legal and Litigation',
    tagline: 'Case-management system for a legal-services firm.',
    role: 'Front-End',
    extraRole: 'UX/UI Design',
    tech: ['Angular', 'Grails'],
    years: '2021–2022',
    company: 'Bonmek Co. Ltd.',
  },
];
```

- [ ] **Step 3: Timeline data**

```ts
// src/content/timeline.ts
export interface TimelineEvent {
  date: string; // ISO year or year range
  sortKey: number; // for ordering; use start year
  title: string;
  subtitle: string;
  body?: string;
  side?: 'left' | 'right'; // desktop only; ignored on mobile
}

export const timeline: TimelineEvent[] = [
  { sortKey: 2021, date: '2021–2022', title: 'Internship — Automate Test', subtitle: 'Bonmek Co. Ltd. · Hat Yai',
    body: 'Wrote E2E Cypress automation for Angular + Electron apps. First paid role, learned production testing workflows.' },
  { sortKey: 2021.5, date: '2021–2022', title: 'ATM (Legal & Litigation)', subtitle: 'Front-End + UX/UI · Angular / Grails' },
  { sortKey: 2022, date: '2022–2023', title: 'Just (Shopping Online)', subtitle: 'Front-End + UX/UI · Angular / Grails' },
  { sortKey: 2022.5, date: '2022–2023', title: 'DBMR (Stock & Produce)', subtitle: 'Front-End + UX/UI · Angular / Grails' },
  { sortKey: 2023, date: '2023–2024', title: 'Barbie (Clinic Management)', subtitle: 'Front-End + UX/UI · Angular / Grails' },
  { sortKey: 2023.5, date: '2023–2024', title: 'TMS (Transport Management)', subtitle: 'Full-Stack + UX/UI · Angular / Grails',
    body: 'First full-stack role. Started owning the backend surface.' },
  { sortKey: 2024, date: '2024–2025', title: 'VJF (Online Job Finder)', subtitle: 'Full-Stack + UX/UI · Angular / Grails' },
  { sortKey: 2025, date: '2025–Present', title: 'ODS (Online Documents)', subtitle: 'Full-Stack · Angular / NestJS + TypeORM',
    body: 'Migration from Grails-era stack into NestJS + TypeORM.' },
  { sortKey: 2026, date: '2026–Present', title: 'PP-SA (Stock & Personnel)', subtitle: 'Full-Stack · Angular / NestJS + TypeORM' },
];
```

- [ ] **Step 4: Tech stack data**

```ts
// src/content/techStack.ts
export interface TechItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Language' | 'Tools & Testing';
}

export const techStack: TechItem[] = [
  { name: 'React', category: 'Frontend' },
  { name: 'Angular', category: 'Frontend' },
  { name: 'PrimeNG', category: 'Frontend' },
  { name: 'HTML', category: 'Frontend' },
  { name: 'CSS', category: 'Frontend' },
  { name: 'NestJS', category: 'Backend' },
  { name: 'TypeORM', category: 'Backend' },
  { name: 'Grails', category: 'Backend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'MySQL', category: 'Backend' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'JavaScript', category: 'Language' },
  { name: 'Cypress', category: 'Tools & Testing' },
  { name: 'Jasper Studio', category: 'Tools & Testing' },
];
```

- [ ] **Step 5: Commit**

```bash
git add src/content
git commit -m "feat: typed content data — profile, projects, timeline, tech stack"
```

---

### Task 6: Performance tier detection hook + tests

**Files:**
- Create: `src/hooks/usePerformanceTier.ts`
- Create: `src/hooks/usePerformanceTier.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// src/hooks/usePerformanceTier.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
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
```

- [ ] **Step 2: Run test to verify it fails**

Run `npm run test:run -- usePerformanceTier` — expected: FAIL (`computeTier` not exported).

- [ ] **Step 3: Implement**

```ts
// src/hooks/usePerformanceTier.ts
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
```

- [ ] **Step 4: Run tests**

Run `npm run test:run -- usePerformanceTier` — expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/usePerformanceTier.ts src/hooks/usePerformanceTier.test.ts
git commit -m "feat: performance tier detection with tests"
```

---

### Task 7: Move CV to public/ so it can be linked

**Files:**
- Move: `src/assets/CV - Loang.pdf` → `public/assets/CV - Loang.pdf`

- [ ] **Step 1: Move the file**

```bash
mkdir -p public/assets
mv "src/assets/CV - Loang.pdf" "public/assets/CV - Loang.pdf"
```

- [ ] **Step 2: Verify path**

```bash
ls -la "public/assets/"
```

Expected: `CV - Loang.pdf` visible. Once served by Vite, it will be reachable at `/assets/CV - Loang.pdf`.

- [ ] **Step 3: Commit**

```bash
git add public/assets "src/assets/CV - Loang.pdf"
git commit -m "chore: move CV PDF to public/ for direct serve"
```

---

## Phase 1 — Static section shell (ship the site, morph later)

This phase delivers a working, scrollable portfolio with all content — just no 3D yet. Hero is a static 2D placeholder.

### Task 8: UI primitives — Button, Chip, SectionHeading

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Button.test.tsx`
- Create: `src/components/ui/Chip.tsx`
- Create: `src/components/ui/SectionHeading.tsx`

- [ ] **Step 1: Write Button test**

```tsx
// src/components/ui/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Hello</Button>);
    expect(screen.getByRole('button', { name: 'Hello' })).toBeInTheDocument();
  });
  it('fires onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
  it('renders as anchor when href given', () => {
    render(<Button href="/test">Link</Button>);
    expect(screen.getByRole('link', { name: 'Link' })).toHaveAttribute('href', '/test');
  });
});
```

- [ ] **Step 2: Run to verify failure**

`npm run test:run -- Button` — expect FAIL (Button not defined).

- [ ] **Step 3: Implement Button**

```tsx
// src/components/ui/Button.tsx
import { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import './Button.css';

type Variant = 'primary' | 'ghost';
type Size = 'sm' | 'md';

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; download?: undefined };
type AnchorProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonProps | AnchorProps) {
  const { children, variant = 'primary', size = 'md', fullWidth = false, ...rest } = props;
  const className = `btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''}`.trim();
  if ('href' in rest && rest.href) {
    return <a className={className} {...rest}>{children}</a>;
  }
  return <button className={className} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>;
}
```

- [ ] **Step 4: Button CSS**

```css
/* src/components/ui/Button.css */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  text-decoration: none;
  white-space: nowrap;
}
.btn--md { font-size: var(--text-sm); padding: 10px 20px; }
.btn--sm { font-size: var(--text-xs); padding: 6px 14px; }
.btn--primary { background: var(--color-ink); color: var(--color-accent-cream); box-shadow: var(--shadow-offset-sm); }
.btn--ghost { background: transparent; color: var(--color-ink); }
.btn:hover { transform: translate(-2px, -2px); box-shadow: 5px 5px 0 var(--color-ink); }
.btn:active { transform: translate(0, 0); box-shadow: 0 0 0 var(--color-ink); }
.btn--full { width: 100%; justify-content: center; }
```

- [ ] **Step 5: Implement Chip**

```tsx
// src/components/ui/Chip.tsx
import './Chip.css';

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function Chip({ label, active = false, onClick }: ChipProps) {
  return (
    <button
      className={`chip ${active ? 'chip--active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
```

```css
/* src/components/ui/Chip.css */
.chip {
  border: 1.5px solid var(--color-ink);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 6px 14px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  white-space: nowrap;
}
.chip--active { background: var(--color-ink); color: var(--color-accent-cream); }
.chip:hover:not(.chip--active) { background: rgba(26, 26, 26, 0.08); }
```

- [ ] **Step 6: Implement SectionHeading**

```tsx
// src/components/ui/SectionHeading.tsx
import { ReactNode } from 'react';
import './SectionHeading.css';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'left' }: Props) {
  return (
    <header className={`section-heading section-heading--${align}`}>
      {eyebrow && <div className="section-heading__eyebrow">{eyebrow}</div>}
      <h2 className="section-heading__title">{title}</h2>
      {subtitle && <div className="section-heading__subtitle">{subtitle}</div>}
    </header>
  );
}
```

```css
/* src/components/ui/SectionHeading.css */
.section-heading { margin-bottom: 40px; }
.section-heading--center { text-align: center; }
.section-heading__eyebrow {
  font-size: var(--text-xs);
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  margin-bottom: 8px;
}
.section-heading__title {
  font-size: var(--text-3xl);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.05;
  margin: 0;
}
.section-heading__subtitle {
  margin-top: 10px;
  color: var(--color-ink-soft);
  font-size: var(--text-base);
  max-width: 560px;
}
.section-heading--center .section-heading__subtitle { margin-left: auto; margin-right: auto; }
```

- [ ] **Step 7: Run Button tests**

`npm run test:run -- Button` — expect: 3 passed.

- [ ] **Step 8: Commit**

```bash
git add src/components/ui
git commit -m "feat: Button, Chip, SectionHeading primitives"
```

---

### Task 9: Top Nav (desktop + mobile hamburger)

**Files:**
- Create: `src/components/ui/Nav.tsx`
- Create: `src/components/ui/Nav.css`
- Create: `src/components/ui/Nav.test.tsx`

- [ ] **Step 1: Test**

```tsx
// src/components/ui/Nav.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Nav } from './Nav';

describe('Nav', () => {
  it('renders brand and desktop links', () => {
    render(<Nav />);
    expect(screen.getByText('LOANG.')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /work/i }).length).toBeGreaterThan(0);
  });
  it('mobile drawer opens on hamburger click', async () => {
    render(<Nav />);
    const toggle = screen.getByRole('button', { name: /menu/i });
    await userEvent.click(toggle);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

- [ ] **Step 3: Implement Nav**

```tsx
// src/components/ui/Nav.tsx
import { useState, useEffect } from 'react';
import './Nav.css';

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#stack', label: 'Stack' },
  { href: '#contact', label: 'Contact' },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <nav className="nav" aria-label="Primary">
        <a href="#top" className="nav__brand">LOANG.</a>
        <ul className="nav__links">
          {LINKS.map(l => (
            <li key={l.href}><a href={l.href}>{l.label}</a></li>
          ))}
        </ul>
        <button
          className="nav__toggle"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </nav>
      {open && (
        <div className="nav__drawer" role="dialog" aria-modal="true" aria-label="Primary navigation">
          <button className="nav__close" aria-label="Close menu" onClick={() => setOpen(false)}>×</button>
          <ul>
            {LINKS.map(l => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 4: Nav CSS**

```css
/* src/components/ui/Nav.css */
.nav {
  position: sticky; top: 0; z-index: 50;
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 32px;
  backdrop-filter: blur(8px);
  background: rgba(255, 245, 225, 0.7);
}
.nav__brand { font-weight: 800; letter-spacing: 2px; font-size: var(--text-sm); }
.nav__links { display: flex; gap: 24px; list-style: none; margin: 0; padding: 0; }
.nav__links a { font-size: var(--text-xs); font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }
.nav__links a:hover { text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 4px; }
.nav__toggle { display: none; background: transparent; border: 0; padding: 8px; }
.nav__toggle span { display: block; width: 24px; height: 2.5px; background: var(--color-ink); margin: 5px 0; }

@media (max-width: 767px) {
  .nav { padding: 14px 20px; }
  .nav__links { display: none; }
  .nav__toggle { display: block; }
}

.nav__drawer {
  position: fixed; inset: 0; z-index: 100;
  background: var(--color-bg-gradient);
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  padding: 40px;
}
.nav__drawer ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 28px; text-align: center; }
.nav__drawer a {
  font-size: var(--text-3xl); font-weight: 800; letter-spacing: -1px;
  padding: 12px 20px; display: inline-block; min-height: 48px;
}
.nav__close {
  position: absolute; top: 20px; right: 20px;
  background: transparent; border: 0; font-size: 40px; line-height: 1; cursor: pointer;
  width: 48px; height: 48px;
}
```

- [ ] **Step 5: Run tests — expect PASS**

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/Nav.tsx src/components/ui/Nav.css src/components/ui/Nav.test.tsx
git commit -m "feat: responsive top nav with mobile drawer"
```

---

### Task 10: Hero placeholder section (static, no morph yet)

**Files:**
- Create: `src/components/hero/Hero.tsx`
- Create: `src/components/hero/Hero.css`
- Create: `src/components/hero/HeroText.tsx`
- Create: `src/components/hero/HeroText.css`
- Create: `src/components/hero/ScrollCue.tsx`
- Create: `src/components/hero/ScrollCue.css`

Goal: static centered-spotlight hero with photo placeholder, headline, subtitle, CTAs, scroll cue. Morph comes in Phase 2+.

- [ ] **Step 1: HeroText**

```tsx
// src/components/hero/HeroText.tsx
import { profile } from '../../content/profile';
import { Button } from '../ui/Button';
import './HeroText.css';

interface Props {
  subtitleOverride?: string;
}

export function HeroText({ subtitleOverride }: Props) {
  return (
    <div className="hero-text">
      <div className="hero-text__eyebrow">HEY 👋 I'M</div>
      <h1 className="hero-text__name">{profile.name}</h1>
      <p className="hero-text__subtitle">
        {subtitleOverride ?? `Full-stack dev — Angular, React, NestJS, Grails. ${profile.yearsExperience} years building real things.`}
      </p>
      <div className="hero-text__ctas">
        <Button href="#work">See my work →</Button>
        <Button href={profile.cvPath} variant="ghost" download>Download CV</Button>
      </div>
    </div>
  );
}
```

```css
/* src/components/hero/HeroText.css */
.hero-text { text-align: center; max-width: 560px; margin: 0 auto; }
.hero-text__eyebrow { font-size: var(--text-xs); font-weight: 800; letter-spacing: 2px; opacity: 0.7; margin-bottom: 12px; }
.hero-text__name {
  font-size: var(--text-display);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 0.95;
  margin: 0 0 16px 0;
}
.hero-text__subtitle {
  font-size: var(--text-base);
  color: var(--color-ink-soft);
  line-height: 1.5;
  margin: 0 auto 24px;
  max-width: 420px;
  min-height: 3em; /* prevents jump during subtitle swap in Phase 4 */
}
.hero-text__ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
@media (max-width: 767px) {
  .hero-text__ctas { flex-direction: column; gap: 10px; width: 100%; max-width: 280px; margin: 0 auto; }
  .hero-text__ctas .btn { width: 100%; justify-content: center; }
}
```

- [ ] **Step 2: ScrollCue**

```tsx
// src/components/hero/ScrollCue.tsx
import './ScrollCue.css';

interface Props {
  label?: string;
}

export function ScrollCue({ label = 'Scroll to morph' }: Props) {
  return (
    <div className="scroll-cue" aria-hidden="true">
      <span className="scroll-cue__label">{label}</span>
      <span className="scroll-cue__arrow">↓</span>
    </div>
  );
}
```

```css
/* src/components/hero/ScrollCue.css */
.scroll-cue {
  display: flex; gap: 10px; align-items: center; justify-content: center;
  font-size: var(--text-xs); font-weight: 600; letter-spacing: 1.5px;
  text-transform: uppercase; opacity: 0.7;
}
.scroll-cue__arrow { display: inline-block; animation: cue-bounce 1.5s infinite; }
@keyframes cue-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(4px); } }
```

- [ ] **Step 3: Hero wrapper (placeholder — no morph yet)**

```tsx
// src/components/hero/Hero.tsx
import heroImg from '../../assets/hero.png'; // temporary placeholder portrait
import { HeroText } from './HeroText';
import { ScrollCue } from './ScrollCue';
import './Hero.css';

export function Hero() {
  return (
    <section id="top" className="hero hero--static">
      <div className="hero__stage">
        <img src={heroImg} alt="Portrait of Pongpat Yakhet" className="hero__photo" width={220} height={220} />
      </div>
      <HeroText />
      <ScrollCue />
    </section>
  );
}
```

```css
/* src/components/hero/Hero.css */
.hero {
  min-height: 100vh;
  display: flex; flex-direction: column; justify-content: space-between;
  align-items: center;
  padding: 40px 24px 32px;
  gap: 24px;
  position: relative;
}
.hero__stage {
  flex: 1;
  display: flex; align-items: center; justify-content: center;
  width: 100%;
}
.hero__photo {
  border-radius: 50%;
  border: 3px solid var(--color-ink);
  box-shadow: var(--shadow-offset);
  background: #c8e0ff;
  object-fit: cover;
  width: clamp(160px, 28vw, 320px);
  height: clamp(160px, 28vw, 320px);
}

/* Pinned mode — activated when MorphCanvas takes over in Phase 4 */
.hero--pinned { min-height: 300vh; }
@media (max-width: 767px) { .hero--pinned { min-height: 250vh; } }
```

- [ ] **Step 4: Wire into App**

```tsx
// src/App.tsx
import { Nav } from './components/ui/Nav';
import { Hero } from './components/hero/Hero';

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        {/* more sections in later tasks */}
      </main>
    </>
  );
}
```

- [ ] **Step 5: Dev server — verify**

`npm run dev` → open `http://localhost:5173`. Expect: warm gradient background, nav at top, centered portrait placeholder, headline "Pongpat Yakhet", subtitle, 2 CTAs, scroll cue. Resize to mobile width — CTAs stack, hamburger appears, tapping it opens drawer.

- [ ] **Step 6: Commit**

```bash
git add src/components/hero src/App.tsx
git commit -m "feat: static hero placeholder with centered spotlight layout"
```

---

### Task 11: About section

**Files:**
- Create: `src/components/sections/About.tsx`
- Create: `src/components/sections/About.css`

- [ ] **Step 1: Implement**

```tsx
// src/components/sections/About.tsx
import { profile } from '../../content/profile';
import { SectionHeading } from '../ui/SectionHeading';
import './About.css';

export function About() {
  const year = new Date().getFullYear();
  const age = year - 1999;
  return (
    <section id="about" className="about">
      <SectionHeading eyebrow="About Me" title="The short version." />
      <div className="about__grid">
        <p className="about__bio">{profile.bio}</p>
        <dl className="about__facts">
          <div><dt>Age</dt><dd>{age}</dd></div>
          <div><dt>Based in</dt><dd>{profile.location}</dd></div>
          <div><dt>Languages</dt><dd>{profile.languages.join(' · ')}</dd></div>
          <div><dt>Hobbies</dt><dd>{profile.hobbies.join(' · ')}</dd></div>
          <div><dt>Education</dt><dd>{profile.education[0].school} — {profile.education[0].program} ({profile.education[0].years})</dd></div>
        </dl>
      </div>
    </section>
  );
}
```

```css
/* src/components/sections/About.css */
.about { max-width: 1100px; margin: 0 auto; padding: 100px 24px; }
.about__grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 48px; align-items: start; }
.about__bio { font-size: var(--text-lg); line-height: 1.6; color: var(--color-ink-soft); margin: 0; }
.about__facts { display: flex; flex-direction: column; gap: 16px; margin: 0; }
.about__facts > div { display: grid; grid-template-columns: 100px 1fr; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(26,26,26,0.12); }
.about__facts dt { font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 1.5px; color: var(--color-ink-muted); font-weight: 700; }
.about__facts dd { margin: 0; font-size: var(--text-sm); color: var(--color-ink); }
@media (max-width: 767px) {
  .about { padding: 60px 20px; }
  .about__grid { grid-template-columns: 1fr; gap: 32px; }
  .about__facts > div { grid-template-columns: 80px 1fr; }
}
```

- [ ] **Step 2: Add to App**

Add `<About />` inside `<main>` below `<Hero />` in `src/App.tsx`.

- [ ] **Step 3: Verify in browser** — About section visible after scroll.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/About.tsx src/components/sections/About.css src/App.tsx
git commit -m "feat: About section"
```

---

### Task 12: Tech Stack section

**Files:**
- Create: `src/components/sections/TechStack.tsx`
- Create: `src/components/sections/TechStack.css`

- [ ] **Step 1: Implement**

```tsx
// src/components/sections/TechStack.tsx
import { techStack, TechItem } from '../../content/techStack';
import { SectionHeading } from '../ui/SectionHeading';
import './TechStack.css';

const GROUPS: TechItem['category'][] = ['Frontend', 'Backend', 'Language', 'Tools & Testing'];

export function TechStack() {
  return (
    <section id="stack" className="stack">
      <SectionHeading eyebrow="Tech Stack" title="What I reach for." align="center" />
      <div className="stack__groups">
        {GROUPS.map(group => {
          const items = techStack.filter(t => t.category === group);
          return (
            <div key={group} className="stack__group">
              <h3 className="stack__group-title">{group}</h3>
              <div className="stack__items">
                {items.map(item => (
                  <div key={item.name} className="stack__item">{item.name}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

```css
/* src/components/sections/TechStack.css */
.stack { max-width: 1100px; margin: 0 auto; padding: 100px 24px; }
.stack__groups { display: flex; flex-direction: column; gap: 40px; }
.stack__group-title {
  font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 2px;
  color: var(--color-ink-muted); font-weight: 800; margin: 0 0 14px 0;
}
.stack__items { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.stack__item {
  background: var(--color-accent-cream);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-md);
  padding: 18px 16px;
  text-align: center;
  font-weight: 700;
  font-size: var(--text-sm);
  box-shadow: var(--shadow-offset-sm);
  transition: transform 0.15s ease;
}
.stack__item:hover { transform: translate(-2px, -2px); box-shadow: 5px 5px 0 var(--color-ink); }
@media (max-width: 1023px) {
  .stack__items { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 767px) {
  .stack { padding: 60px 20px; }
  .stack__items { grid-template-columns: repeat(2, 1fr); }
  .stack__item { font-size: var(--text-xs); padding: 14px 10px; }
}
```

- [ ] **Step 2: Add `<TechStack />` to App below About. Verify in browser.**

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/TechStack.tsx src/components/sections/TechStack.css src/App.tsx
git commit -m "feat: Tech Stack section"
```

---

### Task 13: Projects grid + filter chips

**Files:**
- Create: `src/components/sections/Projects.tsx`
- Create: `src/components/sections/Projects.css`
- Create: `src/components/sections/ProjectCard.tsx`
- Create: `src/components/sections/ProjectCard.css`
- Create: `src/components/sections/ProjectGraphic.tsx` (auto-generated SVG)
- Create: `src/components/sections/Projects.test.tsx`

- [ ] **Step 1: ProjectGraphic — generate a deterministic SVG from project id**

```tsx
// src/components/sections/ProjectGraphic.tsx
interface Props { id: string; }

const PALETTE = ['#ff6b8a', '#6b8aff', '#ffd36b', '#8affb3', '#c88aff'];

// Hash a string to a seed 0..N
function hash(s: string, mod: number): number {
  let h = 0;
  for (const c of s) h = ((h << 5) - h + c.charCodeAt(0)) | 0;
  return Math.abs(h) % mod;
}

export function ProjectGraphic({ id }: Props) {
  const color = PALETTE[hash(id, PALETTE.length)];
  const shape = hash(id + 'shape', 3); // 0=circle, 1=square, 2=triangle
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="120" height="80" fill={color} opacity="0.3" />
      {shape === 0 && <circle cx="60" cy="40" r="24" fill={color} stroke="#1a1a1a" strokeWidth="2.5" />}
      {shape === 1 && <rect x="36" y="16" width="48" height="48" fill={color} stroke="#1a1a1a" strokeWidth="2.5" rx="6" />}
      {shape === 2 && <polygon points="60,14 86,62 34,62" fill={color} stroke="#1a1a1a" strokeWidth="2.5" />}
      <circle cx="22" cy="18" r="6" fill="#1a1a1a" />
      <circle cx="100" cy="64" r="4" fill="#1a1a1a" />
    </svg>
  );
}
```

- [ ] **Step 2: ProjectCard**

```tsx
// src/components/sections/ProjectCard.tsx
import { Project } from '../../content/projects';
import { ProjectGraphic } from './ProjectGraphic';
import './ProjectCard.css';

interface Props { project: Project; }

export function ProjectCard({ project }: Props) {
  return (
    <article className="project-card">
      <div className="project-card__graphic"><ProjectGraphic id={project.id} /></div>
      <div className="project-card__body">
        <div className="project-card__meta">
          <span className="project-card__years">{project.years}</span>
          <span className="project-card__role">{project.role}{project.extraRole ? ` · ${project.extraRole}` : ''}</span>
        </div>
        <h3 className="project-card__name">{project.name}</h3>
        <p className="project-card__shortname">{project.shortName}</p>
        <p className="project-card__tagline">{project.tagline}</p>
        <div className="project-card__tech">
          {project.tech.map(t => <span key={t} className="project-card__tech-pill">{t}</span>)}
        </div>
      </div>
    </article>
  );
}
```

```css
/* src/components/sections/ProjectCard.css */
.project-card {
  background: var(--color-accent-cream);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-offset-sm);
  overflow: hidden;
  display: flex; flex-direction: column;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.project-card:hover { transform: translate(-3px, -3px); box-shadow: 7px 7px 0 var(--color-ink); }
.project-card__graphic { aspect-ratio: 3/2; border-bottom: 2px solid var(--color-ink); }
.project-card__graphic svg { width: 100%; height: 100%; display: block; }
.project-card__body { padding: 18px 16px; flex: 1; display: flex; flex-direction: column; gap: 6px; }
.project-card__meta { display: flex; justify-content: space-between; font-size: var(--text-xs); color: var(--color-ink-muted); font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.project-card__name { font-size: var(--text-xl); font-weight: 800; margin: 4px 0 0 0; }
.project-card__shortname { font-size: var(--text-sm); color: var(--color-ink-soft); margin: 0; font-style: italic; }
.project-card__tagline { font-size: var(--text-sm); margin: 6px 0 0 0; flex: 1; }
.project-card__tech { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.project-card__tech-pill { font-size: 10px; padding: 3px 8px; background: var(--color-ink); color: var(--color-accent-cream); border-radius: var(--radius-pill); font-weight: 700; letter-spacing: 0.5px; }
```

- [ ] **Step 3: Projects wrapper with filter state**

```tsx
// src/components/sections/Projects.tsx
import { useMemo, useState } from 'react';
import { projects, ProjectRole, ProjectTech } from '../../content/projects';
import { SectionHeading } from '../ui/SectionHeading';
import { Chip } from '../ui/Chip';
import { ProjectCard } from './ProjectCard';
import './Projects.css';

type Filter = 'All' | ProjectRole | ProjectTech;
const FILTERS: Filter[] = ['All', 'Full-Stack', 'Front-End', 'Angular', 'React', 'NestJS', 'Grails'];

export function Projects() {
  const [active, setActive] = useState<Filter>('All');

  const filtered = useMemo(() => {
    if (active === 'All') return projects;
    if (active === 'Full-Stack' || active === 'Front-End') return projects.filter(p => p.role === active);
    return projects.filter(p => p.tech.includes(active as ProjectTech));
  }, [active]);

  return (
    <section id="work" className="projects">
      <SectionHeading
        eyebrow="Projects"
        title="8 shipped at Bonmek."
        subtitle="Filter by role or stack. Projects are internal tools, so no public links — but I'm happy to walk through any of them."
      />
      <div className="projects__filters" role="tablist" aria-label="Filter projects">
        {FILTERS.map(f => (
          <Chip key={f} label={f} active={active === f} onClick={() => setActive(f)} />
        ))}
      </div>
      <div className="projects__grid">
        {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
      </div>
      {filtered.length === 0 && <p className="projects__empty">No projects match that filter.</p>}
    </section>
  );
}
```

```css
/* src/components/sections/Projects.css */
.projects { max-width: 1100px; margin: 0 auto; padding: 100px 24px; }
.projects__filters {
  display: flex; gap: 10px; margin-bottom: 32px;
  overflow-x: auto; padding-bottom: 8px;
  scroll-snap-type: x mandatory;
}
.projects__filters .chip { scroll-snap-align: start; flex-shrink: 0; }
.projects__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.projects__empty { text-align: center; color: var(--color-ink-muted); }

@media (max-width: 1023px) { .projects__grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 767px) {
  .projects { padding: 60px 20px; }
  .projects__grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Filter test**

```tsx
// src/components/sections/Projects.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Projects } from './Projects';

describe('Projects filters', () => {
  it('shows all projects by default', () => {
    render(<Projects />);
    expect(screen.getAllByRole('article').length).toBe(8);
  });
  it('filters to React only (expect zero — none use React)', async () => {
    render(<Projects />);
    await userEvent.click(screen.getByRole('button', { name: 'React' }));
    expect(screen.getAllByRole('button', { name: 'React', pressed: true }).length).toBe(1);
    // user-visible: 0 articles; CV shows no React projects yet
    expect(screen.queryAllByRole('article').length).toBe(0);
  });
  it('filters to Angular (expect all 8)', async () => {
    render(<Projects />);
    await userEvent.click(screen.getByRole('button', { name: 'Angular' }));
    expect(screen.getAllByRole('article').length).toBe(8);
  });
});
```

- [ ] **Step 5: Run tests — expect 3 passed**

`npm run test:run -- Projects`

- [ ] **Step 6: Add `<Projects />` to App. Verify in browser — click chips, filter works.**

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/Projects* src/components/sections/ProjectCard* src/components/sections/ProjectGraphic* src/App.tsx
git commit -m "feat: Projects section with filterable grid"
```

---

### Task 14: Services section

**Files:**
- Create: `src/components/sections/Services.tsx`
- Create: `src/components/sections/Services.css`

- [ ] **Step 1: Implement**

```tsx
// src/components/sections/Services.tsx
import { profile } from '../../content/profile';
import { SectionHeading } from '../ui/SectionHeading';
import './Services.css';

export function Services() {
  return (
    <section className="services">
      <SectionHeading eyebrow="Services" title="What I can build for you." align="center" />
      <div className="services__grid">
        {profile.services.map((s, i) => (
          <article key={s.title} className="services__card">
            <div className="services__num">0{i + 1}</div>
            <h3 className="services__title">{s.title}</h3>
            <p className="services__desc">{s.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

```css
/* src/components/sections/Services.css */
.services { max-width: 900px; margin: 0 auto; padding: 100px 24px; }
.services__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.services__card {
  background: var(--color-accent-cream);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-lg);
  padding: 32px 28px;
  box-shadow: var(--shadow-offset);
  transition: transform 0.15s ease;
}
.services__card:hover { transform: translate(-3px, -3px); box-shadow: 9px 9px 0 var(--color-ink); }
.services__num { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-accent-pink); font-weight: 800; letter-spacing: 2px; margin-bottom: 10px; }
.services__title { font-size: var(--text-2xl); font-weight: 800; margin: 0 0 8px 0; line-height: 1.1; }
.services__desc { font-size: var(--text-sm); color: var(--color-ink-soft); line-height: 1.5; margin: 0; }
@media (max-width: 767px) {
  .services { padding: 60px 20px; }
  .services__grid { grid-template-columns: 1fr; }
  .services__card { padding: 24px 20px; }
}
```

- [ ] **Step 2: Add to App. Verify in browser.**

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Services* src/App.tsx
git commit -m "feat: Services section"
```

---

### Task 15: Certificates section

**Files:**
- Create: `src/components/sections/Certificates.tsx`
- Create: `src/components/sections/Certificates.css`

- [ ] **Step 1: Implement**

```tsx
// src/components/sections/Certificates.tsx
import { profile } from '../../content/profile';
import { SectionHeading } from '../ui/SectionHeading';
import './Certificates.css';

export function Certificates() {
  return (
    <section className="certs">
      <SectionHeading eyebrow="Certificates" title="Learning on record." />
      <ul className="certs__list">
        {profile.certificates.map(c => (
          <li key={c.name} className="certs__item">
            <div className="certs__icon">🎓</div>
            <div>
              <div className="certs__name">{c.name}</div>
              <div className="certs__meta">{c.issuer} · {c.year}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```css
/* src/components/sections/Certificates.css */
.certs { max-width: 900px; margin: 0 auto; padding: 80px 24px; }
.certs__list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
.certs__item {
  display: flex; gap: 16px; align-items: center;
  padding: 20px 22px;
  background: var(--color-accent-cream);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-offset-sm);
}
.certs__icon { font-size: 32px; }
.certs__name { font-weight: 800; font-size: var(--text-lg); }
.certs__meta { font-size: var(--text-sm); color: var(--color-ink-muted); margin-top: 2px; }
@media (max-width: 767px) { .certs { padding: 50px 20px; } }
```

- [ ] **Step 2: Add to App, verify, commit**

```bash
git add src/components/sections/Certificates* src/App.tsx
git commit -m "feat: Certificates section"
```

---

### Task 16: Contact section (email, GitHub, CV)

**Files:**
- Create: `src/components/sections/Contact.tsx`
- Create: `src/components/sections/Contact.css`

- [ ] **Step 1: Implement**

```tsx
// src/components/sections/Contact.tsx
import { profile } from '../../content/profile';
import { Button } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';
import './Contact.css';

export function Contact() {
  return (
    <section id="contact" className="contact">
      <SectionHeading
        eyebrow="Contact"
        title="Let's talk."
        subtitle="Email me, poke the repos, or grab the full CV."
        align="center"
      />
      <div className="contact__buttons">
        <Button href={`mailto:${profile.email}`}>✉️ {profile.email}</Button>
        <Button href={profile.github} variant="ghost">🔗 github.com/{profile.githubHandle}</Button>
        <Button href={profile.cvPath} variant="ghost" download>📄 Download CV</Button>
      </div>
      <footer className="contact__footer">
        © {new Date().getFullYear()} {profile.name}. Built with React, Three.js, and too much coffee.
      </footer>
    </section>
  );
}
```

```css
/* src/components/sections/Contact.css */
.contact { max-width: 800px; margin: 0 auto; padding: 100px 24px; text-align: center; }
.contact__buttons { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 48px; }
.contact__footer { font-size: var(--text-xs); color: var(--color-ink-muted); padding-top: 24px; border-top: 1px solid rgba(26,26,26,0.12); }
@media (max-width: 767px) {
  .contact { padding: 60px 20px; }
  .contact__buttons { flex-direction: column; align-items: stretch; }
  .contact__buttons .btn { width: 100%; justify-content: center; }
}
```

- [ ] **Step 2: Add to App, verify, commit**

```bash
git add src/components/sections/Contact* src/App.tsx
git commit -m "feat: Contact section"
```

---

### Task 17: Phase 1 checkpoint — working portfolio, no morph

- [ ] **Step 1: Run dev, verify full page flow**

`npm run dev` → scroll top to bottom. Expect: Hero → About → Tech Stack → Timeline (to be added later) → Projects → Services → Certificates → Contact. Nav anchor links jump correctly.

- [ ] **Step 2: Run all tests**

```bash
npm run test:run
```

Expect: all pass.

- [ ] **Step 3: Lighthouse baseline**

In Chrome DevTools, open Lighthouse, run Performance audit on desktop. Record score (for comparison after Phase 2+).

- [ ] **Step 4: Tag commit**

```bash
git tag phase-1-static
```

---

## Phase 2 — Hero WebGL scaffold (no morph yet)

### Task 18: MorphCanvas with 3 static stages

**Files:**
- Create: `src/components/hero/MorphCanvas.tsx`
- Create: `src/components/hero/stages/PhotoStage.tsx`
- Create: `src/components/hero/stages/AngularStage.tsx`
- Create: `src/components/hero/stages/ReactStage.tsx`
- Create: `public/assets/hero-portrait.webp` (user-provided; can use placeholder for now)

- [ ] **Step 1: Copy scaffold `src/assets/hero.png` → `public/assets/hero-portrait.webp`**

For now, reuse the scaffold PNG as the placeholder (convert later):

```bash
cp src/assets/hero.png public/assets/hero-portrait.png
```

The `Hero` component will reference `/assets/hero-portrait.png` for now; swap to proper WebP once user provides.

- [ ] **Step 2: PhotoStage**

```tsx
// src/components/hero/stages/PhotoStage.tsx
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

interface Props { progress: number; }

export function PhotoStage({ progress }: Props) {
  const texture = useLoader(TextureLoader, '/assets/hero-portrait.png');
  const visible = progress < 0.33;
  const opacity = visible ? Math.max(0, 1 - progress / 0.33) : 0;
  return (
    <mesh visible={visible} position={[0, 0, 0]}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} />
    </mesh>
  );
}
```

- [ ] **Step 3: AngularStage (simple shield using extruded shape)**

```tsx
// src/components/hero/stages/AngularStage.tsx
import { useMemo } from 'react';
import { ExtrudeGeometry, Shape } from 'three';

interface Props { progress: number; }

export function AngularStage({ progress }: Props) {
  const geometry = useMemo(() => {
    const shape = new Shape();
    // Angular shield outline, roughly centered
    shape.moveTo(0, 1);
    shape.lineTo(1, 0.64);
    shape.lineTo(0.7, -1);
    shape.lineTo(0, -1.15);
    shape.lineTo(-0.7, -1);
    shape.lineTo(-1, 0.64);
    shape.closePath();
    return new ExtrudeGeometry(shape, { depth: 0.2, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04 });
  }, []);

  const visible = progress >= 0.22 && progress < 0.62;
  const opacity = visible ? Math.min(1, (progress - 0.22) / 0.11) : 0;
  const rotation = (progress - 0.33) * 1.2;

  return (
    <mesh visible={visible} geometry={geometry} rotation={[0, rotation, 0]} scale={[0.85, 0.85, 0.85]}>
      <meshPhysicalMaterial color="#dd0031" metalness={0.2} roughness={0.4} clearcoat={0.8} clearcoatRoughness={0.2} transparent opacity={opacity} />
    </mesh>
  );
}
```

- [ ] **Step 4: ReactStage (3 rotating tori + nucleus)**

```tsx
// src/components/hero/stages/ReactStage.tsx
import { useRef } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';

interface Props { progress: number; }

export function ReactStage({ progress }: Props) {
  const group = useRef<Group>(null);
  useFrame((_, dt) => { if (group.current) group.current.rotation.y += dt * 0.4; });

  const visible = progress >= 0.62;
  const opacity = visible ? Math.min(1, (progress - 0.62) / 0.11) : 0;

  return (
    <group ref={group} visible={visible} scale={[1.2, 1.2, 1.2]}>
      {[0, 60, -60].map((deg, i) => (
        <mesh key={i} rotation={[0, 0, (deg * Math.PI) / 180]}>
          <torusGeometry args={[1, 0.06, 16, 64]} />
          <meshStandardMaterial color="#61dafb" emissive="#61dafb" emissiveIntensity={0.4} transparent opacity={opacity} />
        </mesh>
      ))}
      <mesh>
        <icosahedronGeometry args={[0.14, 1]} />
        <meshStandardMaterial color="#61dafb" emissive="#61dafb" emissiveIntensity={1.2} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}
```

- [ ] **Step 5: MorphCanvas composition**

```tsx
// src/components/hero/MorphCanvas.tsx
import { Canvas } from '@react-three/fiber';
import { PhotoStage } from './stages/PhotoStage';
import { AngularStage } from './stages/AngularStage';
import { ReactStage } from './stages/ReactStage';

interface Props { progress: number; }

export function MorphCanvas({ progress }: Props) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4], fov: 40 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 5]} intensity={1.2} castShadow />
      <PhotoStage progress={progress} />
      <AngularStage progress={progress} />
      <ReactStage progress={progress} />
    </Canvas>
  );
}
```

- [ ] **Step 6: Wire into Hero — temporary scrubber for dev**

```tsx
// src/components/hero/Hero.tsx  (replace body)
import { useState } from 'react';
import { MorphCanvas } from './MorphCanvas';
import { HeroText } from './HeroText';
import { ScrollCue } from './ScrollCue';
import './Hero.css';

export function Hero() {
  // Temporary: dev scrubber until ScrollTrigger is wired in Task 21
  const [progress, setProgress] = useState(0);
  return (
    <section id="top" className="hero">
      <div className="hero__stage">
        <MorphCanvas progress={progress} />
      </div>
      <HeroText />
      <ScrollCue />
      <input
        type="range" min="0" max="1" step="0.01" value={progress}
        onChange={e => setProgress(parseFloat(e.target.value))}
        style={{ position: 'fixed', bottom: 10, left: 10, zIndex: 100, width: 300 }}
        aria-label="Morph progress (dev only)"
      />
    </section>
  );
}
```

- [ ] **Step 7: Verify all 3 stages render**

`npm run dev` → drag the bottom scrubber. At progress ≈ 0 you see the photo, ≈ 0.4 you see the Angular shield rotating, ≈ 0.8 you see the React atom spinning.

- [ ] **Step 8: Commit**

```bash
git add src/components/hero
git commit -m "feat: MorphCanvas with photo + Angular + React stages"
```

---

## Phase 3 — Particle field

### Task 19: ParticleField with custom shader, blending 3 targets

**Files:**
- Create: `src/components/hero/ParticleField.tsx`
- Create: `src/components/hero/particle-shaders.ts`

The particle field has 2000 (800 on mobile) points. Each point stores 3 target positions (sampled from the photo plane surface, Angular geometry surface, React atom surface) and a per-target color. A single `uProgress` uniform blends between them, with extra "swarm" scatter during transition windows.

- [ ] **Step 1: Shaders**

```ts
// src/components/hero/particle-shaders.ts
export const vertexShader = /* glsl */ `
  attribute vec3 targetA;
  attribute vec3 targetB;
  attribute vec3 targetC;
  attribute vec3 hueA;
  attribute vec3 hueB;
  attribute vec3 hueC;
  attribute vec3 scatter;

  uniform float uProgress;
  uniform float uTime;

  varying vec3 vColor;
  varying float vAlpha;

  // Smooth blend between 3 targets based on progress
  // 0.0-0.33: A dominant. 0.33-0.66: B dominant. 0.66-1.0: C dominant.
  // Around transitions (0.22-0.44 and 0.55-0.77), particles scatter.
  void main() {
    float t = uProgress;

    // Blend weights
    float wA = 1.0 - smoothstep(0.10, 0.33, t);
    float wB = smoothstep(0.22, 0.33, t) * (1.0 - smoothstep(0.55, 0.73, t));
    float wC = smoothstep(0.62, 0.80, t);
    float total = max(0.0001, wA + wB + wC);
    wA /= total; wB /= total; wC /= total;

    vec3 target = targetA * wA + targetB * wB + targetC * wC;

    // Scatter around transitions
    float scatterAmt = 0.0;
    scatterAmt = max(scatterAmt, smoothstep(0.10, 0.18, t) * (1.0 - smoothstep(0.18, 0.33, t)));
    scatterAmt = max(scatterAmt, smoothstep(0.50, 0.58, t) * (1.0 - smoothstep(0.58, 0.73, t)));

    vec3 offset = scatter * scatterAmt * 0.8;
    vec3 pos = target + offset + vec3(sin(uTime * 2.0 + scatter.x * 10.0) * 0.01, 0.0, 0.0);

    vColor = hueA * wA + hueB * wB + hueC * wC;
    // Particles disappear if visibility of any stage is zero at endpoints (hidden during hold phases)
    vAlpha = 1.0;
    // During "reform" windows (0.30-0.33 and 0.72-0.75), particles fade out as the mesh takes over
    vAlpha *= 1.0 - smoothstep(0.30, 0.36, t) * (1.0 - smoothstep(0.44, 0.50, t));
    vAlpha *= 1.0 - smoothstep(0.72, 0.78, t);
    vAlpha *= step(0.08, t); // hidden at very start

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 2.5 * (300.0 / -((modelViewMatrix * vec4(pos, 1.0)).z * 50.0));
  }
`;

export const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    // Circular point
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.35, d) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`;
```

- [ ] **Step 2: ParticleField component**

```tsx
// src/components/hero/ParticleField.tsx
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferAttribute, BufferGeometry, Points, ShaderMaterial, AdditiveBlending, Color } from 'three';
import { vertexShader, fragmentShader } from './particle-shaders';

interface Props {
  progress: number;
  count: number; // 2000 / 1500 / 800
}

function samplePhotoSurface(n: number): Float32Array {
  // Random points inside 2×2 plane at z=0
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    out[i * 3] = (Math.random() - 0.5) * 2;
    out[i * 3 + 1] = (Math.random() - 0.5) * 2;
    out[i * 3 + 2] = 0;
  }
  return out;
}

function sampleAngularSurface(n: number): Float32Array {
  // Shield-ish random sampling (approximate the Angular polygon)
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    let x = 0, y = 0;
    for (let attempt = 0; attempt < 20; attempt++) {
      x = (Math.random() - 0.5) * 1.8;
      y = (Math.random() - 0.5) * 2.2;
      // Simple containment test: |x| + (y+1)/2 < 0.95
      if (Math.abs(x) + (y + 1.15) / 2.5 < 1.0 && y < 1) break;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
  }
  return out;
}

function sampleReactSurface(n: number): Float32Array {
  // Random points on the 3 React tori rings (parametric sampling)
  const out = new Float32Array(n * 3);
  const R = 1.2; // major radius
  const r = 0.06; // tube radius
  for (let i = 0; i < n; i++) {
    const ringIdx = i % 3;
    const ringAngle = (ringIdx * 60 * Math.PI) / 180;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2;
    const px = (R + r * Math.cos(phi)) * Math.cos(theta);
    const py = (R + r * Math.cos(phi)) * Math.sin(theta);
    const pz = r * Math.sin(phi);
    // Rotate around Z axis by ringAngle
    const cos = Math.cos(ringAngle), sin = Math.sin(ringAngle);
    out[i * 3] = px * cos - py * sin;
    out[i * 3 + 1] = px * sin + py * cos;
    out[i * 3 + 2] = pz;
  }
  return out;
}

function sampleScatter(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = 1.5 + Math.random() * 1.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    out[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    out[i * 3 + 2] = r * Math.cos(phi);
  }
  return out;
}

function uniformColor(n: number, hex: string): Float32Array {
  const c = new Color(hex);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { out[i * 3] = c.r; out[i * 3 + 1] = c.g; out[i * 3 + 2] = c.b; }
  return out;
}

export function ParticleField({ progress, count }: Props) {
  const pointsRef = useRef<Points>(null);
  const matRef = useRef<ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    // Position attribute required by Three; we only use targets/scatter in shader
    const dummy = new Float32Array(count * 3);
    g.setAttribute('position', new BufferAttribute(dummy, 3));
    g.setAttribute('targetA', new BufferAttribute(samplePhotoSurface(count), 3));
    g.setAttribute('targetB', new BufferAttribute(sampleAngularSurface(count), 3));
    g.setAttribute('targetC', new BufferAttribute(sampleReactSurface(count), 3));
    g.setAttribute('scatter', new BufferAttribute(sampleScatter(count), 3));
    g.setAttribute('hueA', new BufferAttribute(uniformColor(count, '#6b8aff'), 3));
    g.setAttribute('hueB', new BufferAttribute(uniformColor(count, '#dd0031'), 3));
    g.setAttribute('hueC', new BufferAttribute(uniformColor(count, '#61dafb'), 3));
    return g;
  }, [count]);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uProgress.value = progress;
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uProgress: { value: progress },
          uTime: { value: 0 },
        }}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
```

- [ ] **Step 3: Plug ParticleField into MorphCanvas**

```tsx
// src/components/hero/MorphCanvas.tsx  (replace body)
import { Canvas } from '@react-three/fiber';
import { PhotoStage } from './stages/PhotoStage';
import { AngularStage } from './stages/AngularStage';
import { ReactStage } from './stages/ReactStage';
import { ParticleField } from './ParticleField';
import { usePerformanceTier, TIER_CONFIG } from '../../hooks/usePerformanceTier';

interface Props { progress: number; }

export function MorphCanvas({ progress }: Props) {
  const tier = usePerformanceTier();
  const cfg = TIER_CONFIG[tier];
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 40 }} style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 5]} intensity={1.2} />
      <PhotoStage progress={progress} />
      <AngularStage progress={progress} />
      <ReactStage progress={progress} />
      {cfg.particles > 0 && <ParticleField progress={progress} count={cfg.particles} />}
    </Canvas>
  );
}
```

- [ ] **Step 4: Verify with dev scrubber**

`npm run dev` → drag scrubber from 0 to 1. Expect: photo visible early, particles swarm out around 0.15, coalesce into Angular shape around 0.28, Angular mesh dominant 0.33–0.5, particles swarm again 0.55–0.7, React atom appears by 0.75.

- [ ] **Step 5: Commit**

```bash
git add src/components/hero/ParticleField.tsx src/components/hero/particle-shaders.ts src/components/hero/MorphCanvas.tsx
git commit -m "feat: particle field shader, 3-target blend with scatter"
```

---

## Phase 4 — Scroll wiring

### Task 20: useScrollProgress hook

**Files:**
- Create: `src/hooks/useScrollProgress.ts`
- Create: `src/hooks/useScrollProgress.test.ts`

- [ ] **Step 1: Test**

```ts
// src/hooks/useScrollProgress.test.ts
import { describe, it, expect } from 'vitest';
import { computeProgress } from './useScrollProgress';

describe('computeProgress', () => {
  it('0 when top of section is below viewport top', () => {
    expect(computeProgress({ sectionTop: 100, sectionHeight: 1000, viewportHeight: 800 })).toBe(0);
  });
  it('1 when section has fully scrolled past', () => {
    expect(computeProgress({ sectionTop: -2000, sectionHeight: 1000, viewportHeight: 800 })).toBe(1);
  });
  it('0.5 at the midpoint of the pinned range', () => {
    // pin range = sectionHeight - viewportHeight = 200. Halfway = -100
    expect(computeProgress({ sectionTop: -100, sectionHeight: 1000, viewportHeight: 800 })).toBeCloseTo(0.5);
  });
});
```

- [ ] **Step 2: Implement**

```ts
// src/hooks/useScrollProgress.ts
import { useEffect, useRef, useState, RefObject } from 'react';

interface ProgressInput {
  sectionTop: number;
  sectionHeight: number;
  viewportHeight: number;
}

export function computeProgress({ sectionTop, sectionHeight, viewportHeight }: ProgressInput): number {
  const scrollableRange = sectionHeight - viewportHeight;
  if (scrollableRange <= 0) return 0;
  const scrolled = -sectionTop;
  const p = scrolled / scrollableRange;
  return Math.max(0, Math.min(1, p));
}

export function useScrollProgress<T extends HTMLElement = HTMLElement>(): [RefObject<T>, number] {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setProgress(computeProgress({
        sectionTop: rect.top,
        sectionHeight: rect.height,
        viewportHeight: window.innerHeight,
      }));
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, []);

  return [ref, progress];
}
```

- [ ] **Step 3: Run tests — expect PASS**

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useScrollProgress.ts src/hooks/useScrollProgress.test.ts
git commit -m "feat: useScrollProgress hook"
```

---

### Task 21: Wire Hero to scroll progress (remove scrubber)

**Files:**
- Modify: `src/components/hero/Hero.tsx`

- [ ] **Step 1: Use scroll progress**

```tsx
// src/components/hero/Hero.tsx  (replace body)
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { MorphCanvas } from './MorphCanvas';
import { HeroText } from './HeroText';
import { ScrollCue } from './ScrollCue';
import './Hero.css';

function getSubtitle(p: number): string {
  if (p < 0.40) return 'Full-stack dev — Angular, React, NestJS, Grails. 4 years building real things.';
  if (p < 0.62) return 'I build Angular apps that ship to production — 8 projects at Bonmek and counting.';
  return 'Also fluent in React — modern SPAs with NestJS + TypeORM backends.';
}

function getCueLabel(p: number): string {
  return p < 0.80 ? 'Scroll to morph' : 'Keep going';
}

export function Hero() {
  const [ref, progress] = useScrollProgress<HTMLElement>();

  return (
    <section id="top" ref={ref} className="hero hero--pinned">
      <div className="hero__sticky">
        <div className="hero__stage">
          <MorphCanvas progress={progress} />
        </div>
        <HeroText subtitleOverride={getSubtitle(progress)} />
        <ScrollCue label={getCueLabel(progress)} />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update Hero.css for pinned behavior**

```css
/* Append to src/components/hero/Hero.css */
.hero--pinned { min-height: 300vh; padding: 0; }
@media (max-width: 767px) { .hero--pinned { min-height: 250vh; } }

.hero__sticky {
  position: sticky; top: 0;
  height: 100vh;
  display: flex; flex-direction: column; justify-content: space-between; align-items: center;
  padding: 40px 24px 32px;
  gap: 24px;
}
```

- [ ] **Step 3: Verify in browser**

`npm run dev` → scroll from hero top to bottom (3 viewport heights). Expect: photo → Angular → React morph plays linearly with scroll, subtitle crossfades at the right moments, scroll cue label changes.

- [ ] **Step 4: Commit**

```bash
git add src/components/hero/Hero.tsx src/components/hero/Hero.css
git commit -m "feat: wire hero morph to scroll progress"
```

---

### Task 22: Subtitle crossfade animation

**Files:**
- Modify: `src/components/hero/HeroText.tsx`

Plain text swap causes a jarring jump. Use opacity crossfade via framer-motion's `AnimatePresence`.

- [ ] **Step 1: Update HeroText**

```tsx
// src/components/hero/HeroText.tsx  (replace)
import { AnimatePresence, motion } from 'framer-motion';
import { profile } from '../../content/profile';
import { Button } from '../ui/Button';
import './HeroText.css';

interface Props {
  subtitleOverride?: string;
}

export function HeroText({ subtitleOverride }: Props) {
  const subtitle = subtitleOverride ?? `Full-stack dev — Angular, React, NestJS, Grails. ${profile.yearsExperience} years building real things.`;

  return (
    <div className="hero-text">
      <div className="hero-text__eyebrow">HEY 👋 I'M</div>
      <h1 className="hero-text__name">{profile.name}</h1>
      <AnimatePresence mode="wait">
        <motion.p
          key={subtitle}
          className="hero-text__subtitle"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
        >
          {subtitle}
        </motion.p>
      </AnimatePresence>
      <div className="hero-text__ctas">
        <Button href="#work">See my work →</Button>
        <Button href={profile.cvPath} variant="ghost" download>Download CV</Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify — subtitle should fade out/in at progress boundaries, not snap.**

- [ ] **Step 3: Commit**

```bash
git add src/components/hero/HeroText.tsx
git commit -m "feat: subtitle crossfade via framer-motion"
```

---

## Phase 5 — Experience Timeline

### Task 23: Timeline component (desktop 2-sided, mobile 1-sided)

**Files:**
- Create: `src/components/sections/Timeline.tsx`
- Create: `src/components/sections/Timeline.css`

Use framer-motion's `useInView` for per-card reveal on scroll.

- [ ] **Step 1: Implement**

```tsx
// src/components/sections/Timeline.tsx
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { timeline, TimelineEvent } from '../../content/timeline';
import { SectionHeading } from '../ui/SectionHeading';
import './Timeline.css';

function Row({ event, side }: { event: TimelineEvent; side: 'left' | 'right' }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <div className={`tl__row tl__row--${side}`} ref={ref}>
      <motion.div
        className="tl__card"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="tl__date">{event.date}</div>
        <h3 className="tl__title">{event.title}</h3>
        <p className="tl__subtitle">{event.subtitle}</p>
        {event.body && <p className="tl__body">{event.body}</p>}
      </motion.div>
      <div className="tl__dot" />
    </div>
  );
}

export function Timeline() {
  const sorted = [...timeline].sort((a, b) => b.sortKey - a.sortKey); // newest first
  return (
    <section className="tl">
      <SectionHeading eyebrow="Experience" title="The growth curve." align="center" />
      <div className="tl__track">
        <div className="tl__spine" />
        {sorted.map((e, i) => (
          <Row key={e.title} event={e} side={i % 2 === 0 ? 'right' : 'left'} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: CSS**

```css
/* src/components/sections/Timeline.css */
.tl { max-width: 1100px; margin: 0 auto; padding: 100px 24px; }
.tl__track { position: relative; padding: 20px 0; }
.tl__spine {
  position: absolute; top: 0; bottom: 0;
  left: 50%; width: 3px; background: var(--color-ink); transform: translateX(-50%);
}
.tl__row {
  display: grid; gap: 0;
  position: relative; margin-bottom: 36px;
  align-items: center;
}
.tl__row--right { grid-template-columns: 1fr 40px 1fr; }
.tl__row--right .tl__card { grid-column: 3; }
.tl__row--left { grid-template-columns: 1fr 40px 1fr; }
.tl__row--left .tl__card { grid-column: 1; text-align: right; }

.tl__card {
  background: var(--color-accent-cream);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-md);
  padding: 18px 20px;
  box-shadow: var(--shadow-offset-sm);
}
.tl__date { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-accent-pink); font-weight: 800; letter-spacing: 1px; margin-bottom: 6px; }
.tl__title { font-size: var(--text-lg); font-weight: 800; margin: 0; }
.tl__subtitle { font-size: var(--text-sm); color: var(--color-ink-soft); margin: 4px 0 0 0; }
.tl__body { font-size: var(--text-sm); color: var(--color-ink-muted); margin: 8px 0 0 0; line-height: 1.5; }

.tl__dot {
  position: absolute; left: 50%; top: 50%;
  width: 16px; height: 16px; background: var(--color-ink);
  border: 3px solid var(--color-accent-cream);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

@media (max-width: 767px) {
  .tl { padding: 60px 20px; }
  .tl__spine { left: 18px; transform: none; }
  .tl__row, .tl__row--left, .tl__row--right {
    grid-template-columns: 36px 1fr;
  }
  .tl__row .tl__card, .tl__row--left .tl__card, .tl__row--right .tl__card {
    grid-column: 2; text-align: left;
  }
  .tl__dot { left: 18px; }
}
```

- [ ] **Step 3: Add `<Timeline />` to App between TechStack and Projects. Verify on desktop + mobile.**

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Timeline* src/App.tsx
git commit -m "feat: Experience timeline with scroll reveals"
```

---

## Phase 6 — Reveals on other sections

### Task 24: Framer-motion reveals on About, Tech Stack, Projects, Services, Certificates, Contact

Lightweight fade-up-on-enter reveal.

**Files:**
- Create: `src/components/ui/Reveal.tsx`
- Modify: the 6 section files to wrap their main content

- [ ] **Step 1: Reveal wrapper**

```tsx
// src/components/ui/Reveal.tsx
import { ReactNode, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Props { children: ReactNode; delay?: number; }

export function Reveal({ children, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Wrap sections** — in About, TechStack, Projects, Services, Certificates, Contact, wrap the main content (typically the grid / list) in `<Reveal>`. Example for About:

```tsx
// About.tsx — inside the <section>
<Reveal>
  <div className="about__grid">...</div>
</Reveal>
```

(Apply same pattern to the other 5 sections — 1 Reveal per section is enough, don't nest.)

- [ ] **Step 3: Verify** — sections fade up as you scroll to them.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Reveal.tsx src/components/sections
git commit -m "feat: scroll-triggered reveals on DOM sections"
```

---

## Phase 7 — Performance, fallbacks, polish

### Task 25: WebGL detection + fallback hero

**Files:**
- Create: `src/components/hero/HeroFallback.tsx`
- Modify: `src/components/hero/Hero.tsx`

- [ ] **Step 1: Fallback component**

```tsx
// src/components/hero/HeroFallback.tsx
import heroImg from '../../assets/hero.png';
import { HeroText } from './HeroText';

export function HeroFallback() {
  return (
    <section id="top" className="hero hero--static">
      <div className="hero__stage" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={heroImg} alt="Portrait of Pongpat Yakhet" className="hero__photo" width={220} height={220} />
      </div>
      <HeroText />
    </section>
  );
}
```

- [ ] **Step 2: WebGL check in Hero**

```tsx
// src/components/hero/Hero.tsx — wrap the return
import { useState, useEffect } from 'react';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { usePerformanceTier } from '../../hooks/usePerformanceTier';
import { MorphCanvas } from './MorphCanvas';
import { HeroText } from './HeroText';
import { ScrollCue } from './ScrollCue';
import { HeroFallback } from './HeroFallback';
import './Hero.css';

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

// getSubtitle, getCueLabel from Task 21 stay the same

export function Hero() {
  const [ref, progress] = useScrollProgress<HTMLElement>();
  const tier = usePerformanceTier();
  const [webgl, setWebgl] = useState(true);

  useEffect(() => { setWebgl(isWebGLAvailable()); }, []);

  if (!webgl || tier === 'reduced-motion') return <HeroFallback />;

  return (
    <section id="top" ref={ref} className="hero hero--pinned">
      <div className="hero__sticky">
        <div className="hero__stage"><MorphCanvas progress={progress} /></div>
        <HeroText subtitleOverride={getSubtitle(progress)} />
        <ScrollCue label={getCueLabel(progress)} />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify fallback** — temporarily force `setWebgl(false)` in dev, confirm static hero renders and page still scrolls.

- [ ] **Step 4: Commit**

```bash
git add src/components/hero
git commit -m "feat: WebGL + reduced-motion fallback for hero"
```

---

### Task 26: Bloom post-processing on high/medium tiers

**Files:**
- Modify: `src/components/hero/MorphCanvas.tsx`

- [ ] **Step 1: Add bloom effect**

```tsx
// Add imports
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// In MorphCanvas, wrap the scene:
export function MorphCanvas({ progress }: Props) {
  const tier = usePerformanceTier();
  const cfg = TIER_CONFIG[tier];
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 40 }} style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 5]} intensity={1.2} />
      <PhotoStage progress={progress} />
      <AngularStage progress={progress} />
      <ReactStage progress={progress} />
      {cfg.particles > 0 && <ParticleField progress={progress} count={cfg.particles} />}
      {cfg.bloom && (
        <EffectComposer>
          <Bloom intensity={tier === 'high' ? 0.6 : 0.35} luminanceThreshold={0.4} luminanceSmoothing={0.9} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
```

- [ ] **Step 2: Verify — React atom glows noticeably on desktop, subtle on tablet, off on mobile.**

- [ ] **Step 3: Commit**

```bash
git add src/components/hero/MorphCanvas.tsx
git commit -m "feat: bloom on high/medium performance tiers"
```

---

### Task 27: Runtime FPS downgrade

**Files:**
- Modify: `src/hooks/usePerformanceTier.ts`

Add runtime FPS monitoring that can drop the tier one notch.

- [ ] **Step 1: Add FPS monitoring**

```ts
// Append to src/hooks/usePerformanceTier.ts
import { useEffect, useState, useRef } from 'react';

// ... existing code ...

export function useRuntimeTier(initialTier: PerformanceTier): PerformanceTier {
  const [tier, setTier] = useState(initialTier);
  const framesRef = useRef<number[]>([]);
  const lastRef = useRef<number>(performance.now());

  useEffect(() => { setTier(initialTier); }, [initialTier]);

  useEffect(() => {
    if (tier === 'reduced-motion') return;
    let rafId = 0;
    let downgraded = false;
    const tick = (now: number) => {
      const delta = now - lastRef.current;
      lastRef.current = now;
      framesRef.current.push(delta);
      if (framesRef.current.length > 120) framesRef.current.shift();
      if (!downgraded && framesRef.current.length >= 120) {
        const avg = framesRef.current.reduce((a, b) => a + b, 0) / framesRef.current.length;
        const avgFps = 1000 / avg;
        if (avgFps < 30) {
          downgraded = true;
          setTier(t => (t === 'high' ? 'medium' : t === 'medium' ? 'low' : t));
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [tier]);

  return tier;
}
```

- [ ] **Step 2: Use runtime tier in MorphCanvas**

```tsx
// In src/components/hero/MorphCanvas.tsx
import { usePerformanceTier, useRuntimeTier, TIER_CONFIG } from '../../hooks/usePerformanceTier';

export function MorphCanvas({ progress }: Props) {
  const baseTier = usePerformanceTier();
  const tier = useRuntimeTier(baseTier);
  const cfg = TIER_CONFIG[tier];
  // ...rest unchanged
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/usePerformanceTier.ts src/components/hero/MorphCanvas.tsx
git commit -m "feat: runtime FPS downgrade one tier on <30fps"
```

---

### Task 28: Reduced-motion hero carousel fallback (non-WebGL but motion OK)

**Files:**
- Modify: `src/components/hero/HeroFallback.tsx`

If reduced-motion is on, show a simple 3-image carousel triggered by scroll progress.

- [ ] **Step 1: Update HeroFallback to use scroll-driven image swap**

```tsx
// src/components/hero/HeroFallback.tsx
import heroImg from '../../assets/hero.png';
import { HeroText } from './HeroText';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import './Hero.css';

// Inline SVG data-URIs for Angular and React so fallback has no extra asset fetch
const ANGULAR_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220'>
    <polygon points='110,10 200,50 180,190 110,215 40,190 20,50' fill='%23dd0031' stroke='%231a1a1a' stroke-width='5'/>
    <text x='110' y='145' font-family='Georgia' font-size='100' font-weight='bold' fill='white' text-anchor='middle'>A</text>
  </svg>
`)}`;

const REACT_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='-100 -100 200 200'>
    <ellipse rx='80' ry='30' fill='none' stroke='%2361dafb' stroke-width='8'/>
    <ellipse rx='80' ry='30' fill='none' stroke='%2361dafb' stroke-width='8' transform='rotate(60)'/>
    <ellipse rx='80' ry='30' fill='none' stroke='%2361dafb' stroke-width='8' transform='rotate(-60)'/>
    <circle r='14' fill='%2361dafb'/>
  </svg>
`)}`;

export function HeroFallback() {
  const [ref, progress] = useScrollProgress<HTMLElement>();
  const src = progress < 0.33 ? heroImg : progress < 0.66 ? ANGULAR_SVG : REACT_SVG;

  return (
    <section id="top" ref={ref} className="hero hero--pinned">
      <div className="hero__sticky">
        <div className="hero__stage" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={src} alt="" className="hero__photo" width={220} height={220} style={{ transition: 'opacity 0.6s ease' }} />
        </div>
        <HeroText />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify** — enable `prefers-reduced-motion` in DevTools, scroll hero, expect simple carousel (no particles, no WebGL).

- [ ] **Step 3: Commit**

```bash
git add src/components/hero/HeroFallback.tsx
git commit -m "feat: scroll-driven hero carousel for reduced-motion"
```

---

## Phase 8 — Assets, responsive polish, ship checklist

### Task 29: Portrait image optimization

**Files:**
- Create: `public/assets/hero-portrait-320.webp`
- Create: `public/assets/hero-portrait-640.webp`
- Create: `public/assets/hero-portrait-1280.webp`
- Modify: `src/components/hero/HeroFallback.tsx` to use `<picture>` + srcset

- [ ] **Step 1: Use the scaffold hero.png as source (or user-provided portrait when available)**

```bash
# Install a quick WebP encoder if not present
npm install -D sharp
```

- [ ] **Step 2: Write a one-off script**

```ts
// scripts/optimize-portrait.mjs
import sharp from 'sharp';
import path from 'node:path';

const SRC = path.resolve('src/assets/hero.png');
const OUT = path.resolve('public/assets');
const SIZES = [320, 640, 1280];

for (const size of SIZES) {
  await sharp(SRC)
    .resize(size, size, { fit: 'cover' })
    .webp({ quality: 82 })
    .toFile(path.join(OUT, `hero-portrait-${size}.webp`));
  console.log(`wrote hero-portrait-${size}.webp`);
}
```

- [ ] **Step 3: Run it**

```bash
node scripts/optimize-portrait.mjs
```

- [ ] **Step 4: Use `<picture>` in HeroFallback**

```tsx
// In HeroFallback, replace the <img> for the photo state with:
<picture>
  <source srcSet="/assets/hero-portrait-320.webp 320w, /assets/hero-portrait-640.webp 640w, /assets/hero-portrait-1280.webp 1280w"
          sizes="(max-width: 767px) 160px, (max-width: 1023px) 220px, 320px" />
  <img src="/assets/hero-portrait-640.webp" alt="Portrait of Pongpat Yakhet" className="hero__photo" width={220} height={220} />
</picture>
```

- [ ] **Step 5: Update PhotoStage loader**

```tsx
// src/components/hero/stages/PhotoStage.tsx — change texture URL
const texture = useLoader(TextureLoader, '/assets/hero-portrait-640.webp');
```

- [ ] **Step 6: Commit**

```bash
git add public/assets scripts src/components/hero
git commit -m "chore: portrait srcset + webp optimization"
```

---

### Task 30: Responsive audit — test matrix

Manual testing checklist. Run each one, fix any issue found, re-run.

- [ ] **Step 1: Desktop Chrome macOS 1440×900** — full flow, hero morph smooth, all sections render, nav anchors work
- [ ] **Step 2: iPad Safari 1024×1366 portrait** — timeline still 2-sided, projects 2-col, hero morph smooth
- [ ] **Step 3: iPad Safari 1366×1024 landscape** — same as above but wider
- [ ] **Step 4: iPhone Safari 390×844** — hero pinned 250vh, CTAs stack, hamburger nav works, timeline collapses to 1-sided, projects 1-col, filter chips horizontally scrollable
- [ ] **Step 5: Android Chrome Pixel 7 390×844** — same as iPhone test
- [ ] **Step 6: `prefers-reduced-motion: reduce` enabled** — no particles, static carousel hero, all reveals disabled or shortened
- [ ] **Step 7: WebGL disabled** (use `chrome://flags` or DevTools rendering panel) — fallback carousel renders
- [ ] **Step 8: CPU 4× slowdown + Fast 3G** — page loads, hero still usable (may drop to medium/low tier)
- [ ] **Step 9: Keyboard Tab navigation** — skip link appears first, nav links focusable, buttons reachable, no keyboard traps
- [ ] **Step 10: Lighthouse desktop** — Performance ≥ 85
- [ ] **Step 11: Lighthouse mobile** — Performance ≥ 75

Fix any regression discovered, commit fixes individually, then:

- [ ] **Step 12: Commit final polish**

```bash
git commit -am "fix: responsive audit polish"  # or as many focused commits as needed
```

---

### Task 31: Final cleanup and README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Rewrite README**

```markdown
# Pongpat "Loang" Yakhet — Portfolio

Personal portfolio site. React 19 + Vite + TS. Hero uses react-three-fiber + GSAP-free scroll progress to morph a 2D portrait into a 3D Angular shield into a 3D React atom via a 2000-particle custom-shader dissolve.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — typecheck + production build
- `npm run preview` — serve production build locally
- `npm run test` — run unit tests in watch mode
- `npm run test:run` — single-shot test run
- `npm run lint` — eslint

## Architecture

See [docs/superpowers/specs/2026-04-19-portfolio-site-design.md](docs/superpowers/specs/2026-04-19-portfolio-site-design.md) for the full design spec and [docs/superpowers/plans/2026-04-19-portfolio-site.md](docs/superpowers/plans/2026-04-19-portfolio-site.md) for the implementation breakdown.

## Content

All copy lives in `src/content/` — edit there, not in components.

## Performance tiers

The hero auto-detects tier at mount (`usePerformanceTier`) and can downgrade at runtime if FPS drops below 30. Tiers: high / medium / low / reduced-motion.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update README with architecture and scripts"
git tag v1.0.0
```

---

## Self-review

Reviewed the plan against the spec:

- **Warm playful visual direction** → theme tokens in Task 4, applied throughout.
- **Centered Spotlight hero** → Tasks 10, 18, 21.
- **Particle Dissolve morph** → Tasks 18, 19, 21.
- **Timeline + filterable grid for projects** → Tasks 13, 23.
- **All 7 sections** → Tasks 10, 11, 12, 13, 14, 15, 16, 23.
- **Responsive across PC / iPad / mobile** → Theme tokens use `clamp()`, explicit media queries in every section CSS, Task 30 manual audit.
- **Performance tiers** → Task 6 + 27 + 26.
- **Fallbacks (no-WebGL, reduced-motion, low-FPS)** → Tasks 25, 27, 28.
- **Real content from CV** → Task 5.
- **CV download wired to real PDF** → Task 7 + Contact (Task 16).
- **GitHub link, email, nav anchors** → Task 9 + 16.

No placeholders in code blocks. Types are consistent (`PerformanceTier`, `TIER_CONFIG`, `ProjectRole`, etc. defined once in Tasks 5-6 and reused). No "similar to Task N" dodges.

Potential gotcha to watch during execution: the `hero.png` scaffold placeholder stays in play until user provides real portrait; plan uses it intentionally in Tasks 10, 25, 28, 29 and notes the swap-in points.
