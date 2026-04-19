export type ProjectRole = 'Full-Stack' | 'Front-End';
export type ProjectTech = 'Angular' | 'React' | 'NestJS' | 'Grails' | 'TypeORM';

export interface Project {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  role: ProjectRole;
  extraRole?: 'UX/UI Design';
  tech: ProjectTech[];
  years: string;
  company: string;
}

export const projects: Project[] = [
  {
    id: 'pp-sa',
    name: 'PP-SA',
    shortName: 'Stock & Personnel Management',
    tagline: 'Internal system for managing stock inventory and HR records.',
    role: 'Full-Stack',
    tech: ['Angular', 'NestJS', 'TypeORM'],
    years: '2026–Present',
    company: 'Bonmek Co. Ltd.',
  },
  {
    id: 'ods',
    name: 'ODS',
    shortName: 'Online Documents (คำร้องออนไลน์)',
    tagline: 'Online document request and routing platform.',
    role: 'Full-Stack',
    tech: ['Angular', 'NestJS', 'TypeORM'],
    years: '2025–Present',
    company: 'Bonmek Co. Ltd.',
  },
  {
    id: 'vjf',
    name: 'VJF',
    shortName: 'Online Job Finder',
    tagline: 'Job board with applicant tracking and employer dashboards.',
    role: 'Full-Stack',
    extraRole: 'UX/UI Design',
    tech: ['Angular', 'Grails'],
    years: '2024–2025',
    company: 'Bonmek Co. Ltd.',
  },
  {
    id: 'tms',
    name: 'TMS',
    shortName: 'Transport Management System',
    tagline: 'Fleet, route, and delivery tracking for a logistics operator.',
    role: 'Full-Stack',
    extraRole: 'UX/UI Design',
    tech: ['Angular', 'Grails'],
    years: '2023–2024',
    company: 'Bonmek Co. Ltd.',
  },
  {
    id: 'barbie',
    name: 'Barbie',
    shortName: 'Clinic Management System',
    tagline: 'Patient records, scheduling, and billing for a private clinic.',
    role: 'Front-End',
    extraRole: 'UX/UI Design',
    tech: ['Angular', 'Grails'],
    years: '2023–2024',
    company: 'Bonmek Co. Ltd.',
  },
  {
    id: 'just',
    name: 'Just',
    shortName: 'Shopping Online',
    tagline: 'E-commerce storefront with cart, checkout, and order tracking.',
    role: 'Front-End',
    extraRole: 'UX/UI Design',
    tech: ['Angular', 'Grails'],
    years: '2022–2023',
    company: 'Bonmek Co. Ltd.',
  },
  {
    id: 'dbmr',
    name: 'DBMR',
    shortName: 'Stock & Produce Products',
    tagline: 'Warehouse stock + produce manufacturing workflow.',
    role: 'Front-End',
    extraRole: 'UX/UI Design',
    tech: ['Angular', 'Grails'],
    years: '2022–2023',
    company: 'Bonmek Co. Ltd.',
  },
  {
    id: 'atm',
    name: 'ATM',
    shortName: 'Legal and Litigation',
    tagline: 'Case-management system for a legal-services firm.',
    role: 'Front-End',
    extraRole: 'UX/UI Design',
    tech: ['Angular', 'Grails'],
    years: '2021–2022',
    company: 'Bonmek Co. Ltd.',
  },
];
