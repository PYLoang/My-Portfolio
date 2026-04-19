import { lazy, Suspense, useRef } from 'react';
import { profile } from '../content/profile';
import { Button } from '../components/ui/Button';
import { HeroSubtitle } from './HeroSubtitle';

const MorphCanvas = lazy(() =>
  import('../three/MorphCanvas').then((m) => ({ default: m.MorphCanvas }))
);
import { useScrollProgress } from '../hooks/useScrollProgress';
import { usePerformanceTier } from '../hooks/usePerformanceTier';
import { useFpsDowngrade } from '../hooks/useFpsDowngrade';
import { useWebGLSupport } from '../hooks/useWebGLSupport';
import './Hero.css';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);
  const initialTier = usePerformanceTier();
  const tier = useFpsDowngrade(initialTier);
  const webgl = useWebGLSupport();

  const showFallback = tier === 'reduced-motion' || !webgl;

  return (
    <section id="top" className="hero" ref={ref}>
      <div className="hero__sticky">
        {!showFallback && (
          <div className="hero__canvas">
            <Suspense fallback={null}>
              <MorphCanvas progress={progress} tier={tier} />
            </Suspense>
          </div>
        )}

        <div className="hero__inner">
          <p className="hero__eyebrow">Hi, I'm {profile.nickname}.</p>
          <h1 className="hero__title">
            {profile.name.split(' ')[0]}
            <br />
            <span className="hero__title-accent">{profile.name.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="hero__role">{profile.role} · {profile.yearsExperience}+ years</p>

          {showFallback && (
            <div className="hero__visual">
              <picture>
                <source
                  type="image/webp"
                  srcSet="/assets/portrait-320.webp 320w, /assets/portrait-640.webp 640w, /assets/portrait-960.webp 960w"
                  sizes="(max-width: 768px) 220px, 340px"
                />
                <img
                  src="/assets/portrait.png"
                  alt={`Portrait of ${profile.name}`}
                  className="hero__portrait"
                  width={320}
                  height={320}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
          )}

          <HeroSubtitle progress={progress} />

          <div className="hero__cta">
            <Button href="#work" variant="primary">See my work</Button>
            <Button href={profile.cvPath} variant="ghost">Download CV</Button>
          </div>

          <div className="hero__scroll-hint" aria-hidden="true">
            <span>scroll</span>
            <div className="hero__scroll-line" />
          </div>
        </div>
      </div>
    </section>
  );
}
