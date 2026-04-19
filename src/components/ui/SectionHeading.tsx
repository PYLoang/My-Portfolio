import type { ReactNode } from 'react';
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
      <h2 className="section-heading__title">{title}</h2>
      {subtitle && <div className="section-heading__subtitle">{subtitle}</div>}
    </header>
  );
}
