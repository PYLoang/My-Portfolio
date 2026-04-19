import { useRef } from 'react';
import { profile } from '../content/profile';
import { Button } from '../components/ui/Button';
import { MorphCanvas } from '../three/MorphCanvas';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { usePerformanceTier } from '../hooks/usePerformanceTier';
import './Hero.css';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);
  const tier = usePerformanceTier();

  const showFallback = tier === 'reduced-motion';

  return (
    <section id="top" className="hero" ref={ref}>
      <div className="hero__sticky">
        {!showFallback && (
          <div className="hero__canvas">
            <MorphCanvas progress={progress} tier={tier} />
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
              <img
                src="/assets/portrait.png"
                alt={`Portrait of ${profile.name}`}
                className="hero__portrait"
                width={320}
                height={320}
              />
            </div>
          )}

          <p className="hero__subtitle">
            I build delightful products with React, Angular, and a love for the details.
          </p>

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
