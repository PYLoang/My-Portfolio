import { profile } from '../content/profile';
import { SectionHeading } from '../components/ui/SectionHeading';
import './About.css';

export function About() {
  return (
    <section id="about" className="about">
      <div className="about__inner">
        <SectionHeading eyebrow="About" title="Hi, I'm Loang." />
        <div className="about__grid">
          <div className="about__portrait-wrap">
            <picture>
              <source
                type="image/webp"
                srcSet="/assets/portrait-320.webp 320w, /assets/portrait-640.webp 640w, /assets/portrait-960.webp 960w"
                sizes="(max-width: 768px) 220px, 320px"
              />
              <img
                src="/assets/portrait.png"
                alt={`Portrait of ${profile.name}`}
                className="about__portrait"
                width={320}
                height={320}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
          <p className="about__bio">{profile.bio}</p>
          <dl className="about__facts">
            <div><dt>Based in</dt><dd>{profile.location}</dd></div>
            <div><dt>Languages</dt><dd>{profile.languages.join(', ')}</dd></div>
            <div><dt>Education</dt><dd>
              {profile.education.map((e) => (
                <div key={e.school} className="about__edu">
                  <strong>{e.school}</strong>
                  <span>{e.program} · {e.years}</span>
                </div>
              ))}
            </dd></div>
            <div><dt>Off-screen</dt><dd>{profile.hobbies.join(' · ')}</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}
