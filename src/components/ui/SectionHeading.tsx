import type { ReactNode } from 'react';
import { Underline } from './Annotation';
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
      <h2 className="section-heading__title">
        <span className="section-heading__title-inner">
          {title}
          <Underline ink="pencil" className="section-heading__underline" />
        </span>
      </h2>
      {subtitle && <div className="section-heading__subtitle">{subtitle}</div>}
    </header>
  );
}
