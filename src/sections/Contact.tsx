import { profile } from '../content/profile';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import './Contact.css';

export function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="contact__inner">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something."
          subtitle="Open to full-time, contract, and interesting one-off projects."
          align="center"
        />
        <div className="contact__methods">
          <a className="contact__method" href={`mailto:${profile.email}`}>
            <span className="contact__method-label">Email</span>
            <span className="contact__method-value">{profile.email}</span>
          </a>
          <a className="contact__method" href={profile.github} target="_blank" rel="noreferrer">
            <span className="contact__method-label">GitHub</span>
            <span className="contact__method-value">@{profile.githubHandle}</span>
          </a>
        </div>
        <div className="contact__cta">
          <Button href={`mailto:${profile.email}`} variant="primary">Say hello</Button>
          <Button href={profile.cvPath} variant="ghost">Download CV</Button>
        </div>
        <footer className="contact__footer">
          <p>© {new Date().getFullYear()} {profile.name}. Built with React, three.js, and a bit of GSAP.</p>
        </footer>
      </div>
    </section>
  );
}
