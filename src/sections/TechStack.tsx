import { techStack, TechItem } from '../content/techStack';
import { SectionHeading } from '../components/ui/SectionHeading';
import './TechStack.css';

const CATEGORIES: TechItem['category'][] = ['Frontend', 'Backend', 'Language', 'Tools & Testing'];

export function TechStack() {
  return (
    <section id="stack" className="stack">
      <div className="stack__inner">
        <SectionHeading
          eyebrow="Tech Stack"
          title="Tools I reach for"
          subtitle="Production tools I've shipped with — not a wishlist."
        />
        <div className="stack__groups">
          {CATEGORIES.map((cat) => (
            <div key={cat} className="stack__group">
              <h3 className="stack__group-title">{cat}</h3>
              <ul className="stack__list">
                {techStack.filter((t) => t.category === cat).map((t) => (
                  <li key={t.name} className="stack__item">{t.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
