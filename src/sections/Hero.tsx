import { profile } from '../content/profile';
import { Button } from '../components/ui/Button';
import { Underline } from '../components/ui/Annotation';
import './Hero.css';

export function Hero() {
  const [first, ...rest] = profile.name.split(' ');
  const last = rest.join(' ');

  return (
    <section id="top" className="hero">
      <div className="hero__inner">
        <p className="hero__eyebrow">Hi, I'm {profile.nickname} —</p>

        <h1 className="hero__title" aria-label={profile.name}>
          <span className="hero__title-line">{first}</span>
          <span className="hero__title-line hero__title-line--underlined">
            {last}
            <Underline ink="pencil" className="hero__title-underline" />
          </span>
        </h1>

        <p className="hero__role">
          {profile.role} · {profile.yearsExperience}+ years
        </p>

        <div className="hero__cta">
          <Button href="#work" variant="primary">See my work</Button>
          <Button href={profile.cvPath} variant="ghost">Download CV</Button>
        </div>

      </div>
    </section>
  );
}
