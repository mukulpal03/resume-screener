/** Free analyses per calendar month (must match API MAX_MONTHLY_FREE). */
export const FREE_MONTHLY_ANALYSES = 5;

export const HERO_TRUST_POINTS = [
  `✓ ${FREE_MONTHLY_ANALYSES} free analyses per month`,
  '✓ Sign in to run analysis & save history',
  '✓ Structured AI report with actionable tips',
  '✓ Results saved to your account',
] as const;

export const STATS = [
  {
    num: String(FREE_MONTHLY_ANALYSES),
    suffix: '/mo',
    label: 'Free analyses',
    sub: 'Per signed-in account',
  },
  {
    num: '3',
    suffix: '-part',
    label: 'Score breakdown',
    sub: 'Skills, experience & education',
  },
  {
    num: '1',
    suffix: ' min',
    label: 'Typical wait time',
    sub: 'Async AI analysis via queue',
  },
  {
    num: '100',
    suffix: '/100',
    label: 'Match score',
    sub: 'Overall compatibility rating',
  },
] as const;

export const FEATURES = [
  {
    icon: '🎯',
    title: 'AI match score',
    desc: 'Get a 0–100 compatibility score between any resume and job description. Powered by semantic AI — not just keyword matching.',
    wide: true,
  },
  {
    icon: '✅',
    title: 'Skill gap analysis',
    desc: 'See exactly which required skills the candidate has — and which are missing.',
    wide: false,
  },
  {
    icon: '🔑',
    title: 'Keyword detection',
    desc: 'Auto-highlights matched and missing keywords from the job description.',
    wide: false,
  },
  {
    icon: '⚡',
    title: 'Live progress updates',
    desc: 'Watch real-time status as your resume is parsed, analyzed by AI, and saved. Most runs finish in under a minute.',
    wide: false,
  },
  {
    icon: '🔒',
    title: 'Saved to your account',
    desc: 'Signed-in users can revisit past analyses anytime from their results history.',
    wide: false,
  },
] as const;

export const SCORE_BREAKDOWN = [
  { label: 'Experience', pct: 90, color: '#059669' },
  { label: 'Skills', pct: 78, color: '#059669' },
  { label: 'Keywords', pct: 65, color: '#F59E0B' },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    num: '01',
    title: 'Upload the resume',
    desc: 'Drag and drop any PDF or Word document. Our parser handles all formatting automatically.',
    tag: '📄 PDF · DOCX · DOC',
    color: '#ECFDF5',
  },
  {
    num: '02',
    title: 'Paste the job description',
    desc: 'Copy any job posting. Our AI understands requirements, experience levels, and skill expectations.',
    tag: '✍️ Any JD format',
    color: '#F0FDF4',
  },
  {
    num: '03',
    title: 'Sign in & get your report',
    desc: 'Create a free account to run the analysis. Receive match score, skill breakdown, keyword gaps, and section-specific suggestions.',
    tag: '⚡ Usually under a minute',
    color: '#ECFDF5',
  },
] as const;

export const REPORT_HIGHLIGHTS = [
  {
    title: 'Overall compatibility score',
    desc: 'A 0–100 score summarizing how well the resume fits the role, with a plain-language AI summary.',
    icon: '📊',
  },
  {
    title: 'Keyword match & gaps',
    desc: 'See which JD keywords appear in the resume and which are missing — so you know exactly what to add.',
    icon: '🔑',
  },
  {
    title: 'Section-by-section fixes',
    desc: 'Actionable suggestions for Summary, Experience, Skills, Projects, and Education — not generic advice.',
    icon: '✏️',
  },
] as const;

export const TECH_STACK = [
  'Next.js',
  'Express',
  'LangChain',
  'PostgreSQL',
  'Redis',
  'Clerk',
  'TypeScript',
] as const;
