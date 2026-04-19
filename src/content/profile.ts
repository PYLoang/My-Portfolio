export const profile = {
  name: 'Pongpat Yakhet',
  nickname: 'Loang',
  role: 'Full-Stack Developer',
  yearsExperience: 4,
  location: 'Hat Yai, Songkhla',
  born: '1999-05-27',
  languages: ['Thai', 'English'],
  hobbies: ['Technology', 'Games', 'Movies'],
  email: 'pongpatyakhet@gmail.com',
  github: 'https://github.com/PYLoang',
  githubHandle: 'PYLoang',
  cvPath: '/assets/CV - Loang.pdf',
  education: [
    { school: 'Prince of Songkla University', program: 'Computer Engineering', years: '2018–2022' },
    { school: 'Hatyaiwittayalaisomboonkulkanya School', program: 'MCP (Math-Computer) / SMA (Science-Math)', years: '2011–2017' },
  ],
  bio: `I'm Loang, a full-stack developer based in Hat Yai. I've spent the last 4 years at Bonmek Co. Ltd. shipping real production apps — 8 projects and counting — growing from front-end work into full-stack ownership with NestJS + TypeORM backends. I love shipping polished UIs, cleaning up messy data flows, and finding the right abstraction.`,
  services: [
    { title: 'Web App Development', desc: 'Angular or React frontends with production-grade state management, routing, and testing.' },
    { title: 'API Design', desc: 'NestJS + TypeORM or Grails backends — REST design, auth, DB modeling, deployment.' },
  ],
  certificates: [
    { name: 'Cybersecurity Foundation Course', issuer: 'NCSA', year: '2025' },
  ],
} as const;
