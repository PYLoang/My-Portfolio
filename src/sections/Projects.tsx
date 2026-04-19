import { useMemo, useState } from 'react';
import { projects } from '../content/projects';
import type { ProjectRole, ProjectTech } from '../content/projects';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Chip } from '../components/ui/Chip';
import './Projects.css';

type RoleFilter = 'All' | ProjectRole;
type TechFilter = 'All' | ProjectTech;

const ROLES: RoleFilter[] = ['All', 'Full-Stack', 'Front-End'];
const TECHS: TechFilter[] = ['All', 'Angular', 'React', 'NestJS', 'Grails', 'TypeORM'];

export function Projects() {
  const [role, setRole] = useState<RoleFilter>('All');
  const [tech, setTech] = useState<TechFilter>('All');

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (role === 'All' || p.role === role) &&
          (tech === 'All' || p.tech.includes(tech))
      ),
    [role, tech]
  );

  return (
    <section id="work" className="projects">
      <div className="projects__inner">
        <SectionHeading
          eyebrow="Work"
          title="Projects I've shipped"
          subtitle="Eight production systems at Bonmek over four years."
        />

        <div className="projects__filters">
          <div className="projects__filter-row">
            <span className="projects__filter-label">Role</span>
            {ROLES.map((r) => (
              <Chip key={r} label={r} active={role === r} onClick={() => setRole(r)} />
            ))}
          </div>
          <div className="projects__filter-row">
            <span className="projects__filter-label">Tech</span>
            {TECHS.map((t) => (
              <Chip key={t} label={t} active={tech === t} onClick={() => setTech(t)} />
            ))}
          </div>
        </div>

        <ul className="projects__grid">
          {filtered.map((p) => (
            <li key={p.id} className="projects__card">
              <div className="projects__card-head">
                <h3 className="projects__card-name">{p.name}</h3>
                <span className="projects__card-years">{p.years}</span>
              </div>
              <p className="projects__card-short">{p.shortName}</p>
              <p className="projects__card-tagline">{p.tagline}</p>
              <div className="projects__card-meta">
                <span className="projects__role-badge">{p.role}</span>
                {p.extraRole && <span className="projects__role-badge projects__role-badge--alt">{p.extraRole}</span>}
              </div>
              <ul className="projects__card-tech">
                {p.tech.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </li>
          ))}
        </ul>

        {filtered.length === 0 && <p className="projects__empty">No matching projects.</p>}
      </div>
    </section>
  );
}
