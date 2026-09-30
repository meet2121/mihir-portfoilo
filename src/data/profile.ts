// Source of truth: /portfolio-content.md §1–§2, §6. Keep in sync when copy changes.

export const profile = {
  name: 'Mihir Brahmaniya',
  role: 'GenAI Intern',
  discipline: 'AI / Data Science',
  company: 'NoBrokerHood',
  location: 'Bengaluru, India',
  workMode: 'On-site',
  startDate: '23 June 2026',
  email: 'meetbrahmaniya@gmail.com',
  phone: '+91 9316058894',
  phoneHref: 'tel:+919316058894',
  linkedin: 'https://www.linkedin.com/in/mihir-brahmaniya-052758255/',
  // Hidden in v1 (portfolio-content.md): GitHub, resume.
  heroStatement:
    'I build AI systems that turn messy real-world data (invoices, handwritten registers, financial statements, legacy ERP records) into structured, verified information.',
  shortSummary:
    'GenAI Intern at NoBrokerHood who designed and built four production-oriented AI systems end-to-end for accounting document intelligence, financial risk analysis, ledger classification and ERP-migration automation.',
  focusAreas: ['Document intelligence', 'Financial analysis', 'Ledger classification', 'ERP-migration automation'],
} as const;

export const site = {
  title: 'Mihir Brahmaniya · GenAI Intern · AI / Data Science',
  description:
    'Mihir Brahmaniya builds AI systems for document intelligence, financial risk analysis, ledger classification and ERP-migration automation. Four industry projects with interactive demos.',
} as const;
