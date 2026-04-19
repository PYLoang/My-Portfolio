export interface TimelineEvent {
  date: string;
  sortKey: number;
  title: string;
  subtitle: string;
  body?: string;
  side?: 'left' | 'right';
}

export const timeline: TimelineEvent[] = [
  { sortKey: 2021, date: '2021–2022', title: 'Internship — Automate Test', subtitle: 'Bonmek Co. Ltd. · Hat Yai',
    body: 'Wrote E2E Cypress automation for Angular + Electron apps. First paid role, learned production testing workflows.' },
  { sortKey: 2021.5, date: '2021–2022', title: 'ATM (Legal & Litigation)', subtitle: 'Front-End + UX/UI · Angular / Grails' },
  { sortKey: 2022, date: '2022–2023', title: 'Just (Shopping Online)', subtitle: 'Front-End + UX/UI · Angular / Grails' },
  { sortKey: 2022.5, date: '2022–2023', title: 'DBMR (Stock & Produce)', subtitle: 'Front-End + UX/UI · Angular / Grails' },
  { sortKey: 2023, date: '2023–2024', title: 'Barbie (Clinic Management)', subtitle: 'Front-End + UX/UI · Angular / Grails' },
  { sortKey: 2023.5, date: '2023–2024', title: 'TMS (Transport Management)', subtitle: 'Full-Stack + UX/UI · Angular / Grails',
    body: 'First full-stack role. Started owning the backend surface.' },
  { sortKey: 2024, date: '2024–2025', title: 'VJF (Online Job Finder)', subtitle: 'Full-Stack + UX/UI · Angular / Grails' },
  { sortKey: 2025, date: '2025–Present', title: 'ODS (Online Documents)', subtitle: 'Full-Stack · Angular / NestJS + TypeORM',
    body: 'Migration from Grails-era stack into NestJS + TypeORM.' },
  { sortKey: 2026, date: '2026–Present', title: 'PP-SA (Stock & Personnel)', subtitle: 'Full-Stack · Angular / NestJS + TypeORM' },
];
