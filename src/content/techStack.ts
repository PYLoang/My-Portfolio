export interface TechItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Language' | 'Tools & Testing';
}

export const techStack: TechItem[] = [
  { name: 'React', category: 'Frontend' },
  { name: 'Angular', category: 'Frontend' },
  { name: 'PrimeNG', category: 'Frontend' },
  { name: 'HTML', category: 'Frontend' },
  { name: 'CSS', category: 'Frontend' },
  { name: 'NestJS', category: 'Backend' },
  { name: 'TypeORM', category: 'Backend' },
  { name: 'Grails', category: 'Backend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'MySQL', category: 'Backend' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'JavaScript', category: 'Language' },
  { name: 'Cypress', category: 'Tools & Testing' },
  { name: 'Jasper Studio', category: 'Tools & Testing' },
];
