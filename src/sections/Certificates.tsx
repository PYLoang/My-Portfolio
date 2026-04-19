import { profile } from '../content/profile';
import { SectionHeading } from '../components/ui/SectionHeading';
import './Certificates.css';

export function Certificates() {
  return (
    <section id="certificates" className="certs">
      <div className="certs__inner">
        <SectionHeading eyebrow="Certificates" title="Certifications" />
        <ul className="certs__list">
          {profile.certificates.map((c) => (
            <li key={c.name} className="certs__item">
              <div>
                <h3 className="certs__name">{c.name}</h3>
                <p className="certs__issuer">{c.issuer}</p>
              </div>
              <span className="certs__year">{c.year}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
