import { timeline } from '../content/timeline';
import { SectionHeading } from '../components/ui/SectionHeading';
import './Experience.css';

export function Experience() {
  const sorted = [...timeline].sort((a, b) => a.sortKey - b.sortKey);

  return (
    <section id="experience" className="exp">
      <div className="exp__inner">
        <SectionHeading
          eyebrow="Experience"
          title="Four years, eight projects"
          subtitle="From Cypress automation intern to full-stack ownership."
        />
        <ol className="exp__timeline">
          {sorted.map((e, i) => (
            <li key={i} className={`exp__event exp__event--${i % 2 === 0 ? 'left' : 'right'}`}>
              <div className="exp__dot" aria-hidden="true" />
              <div className="exp__card">
                <span className="exp__date">{e.date}</span>
                <h3 className="exp__title">{e.title}</h3>
                <p className="exp__sub">{e.subtitle}</p>
                {e.body && <p className="exp__body">{e.body}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
