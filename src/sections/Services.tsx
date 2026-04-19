import { profile } from '../content/profile';
import { SectionHeading } from '../components/ui/SectionHeading';
import './Services.css';

export function Services() {
  return (
    <section id="services" className="services">
      <div className="services__inner">
        <SectionHeading
          eyebrow="Services"
          title="What I can build for you"
          subtitle="Two things I do well, end-to-end."
        />
        <div className="services__grid">
          {profile.services.map((s) => (
            <article key={s.title} className="services__card">
              <h3 className="services__card-title">{s.title}</h3>
              <p className="services__card-desc">{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
