export const HERO_TRUST_POINTS = [
  '✓ Free forever',
  '✓ No sign-up required',
  '✓ Results in under 10 seconds',
  '✓ 100% private',
] as const;

export const STATS = [
  { num: '60', suffix: '%', label: 'Faster screening', sub: 'vs manual resume review' },
  { num: '10', suffix: 's', label: 'Average analysis time', sub: 'From upload to full report' },
  { num: '50', suffix: 'k+', label: 'Resumes screened', sub: 'By recruiters worldwide' },
  { num: '4.9', suffix: '★', label: 'User rating', sub: 'Based on recruiter feedback' },
] as const;

export const FEATURES = [
  {
    icon: '🎯',
    title: 'Instant match score',
    desc: 'Get a 0–100 compatibility score between any resume and JD. Semantic AI — not just keyword matching.',
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
    title: 'Results in seconds',
    desc: 'Full analysis in under 10 seconds. No queues, no waiting.',
    wide: false,
  },
  {
    icon: '🔒',
    title: 'Private by default',
    desc: 'Resumes are never stored. All processing is session-only.',
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
    title: 'Get your full report',
    desc: 'Receive match score, skill breakdown, keyword gaps, and recommendations — in seconds.',
    tag: '⚡ Under 10 seconds',
    color: '#ECFDF5',
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      'Cut our initial screening time by <strong>60%</strong>. We only interview candidates who actually match the role now.',
    name: 'Sanya Kapoor',
    role: 'Head of Talent · Techflow',
    initials: 'SK',
    color: '#059669',
  },
  {
    quote:
      "The keyword gap analysis is incredible. I can see <strong>exactly why a candidate doesn't fit</strong> without reading the whole resume.",
    name: 'Arjun Reddy',
    role: 'Hiring Manager · BuildFast',
    initials: 'AR',
    color: '#0891B2',
  },
  {
    quote:
      'Simple, fast, no fluff. We use it for <strong>every single role</strong>. The match score gives real confidence.',
    name: 'Priya Mehta',
    role: 'Recruiter · Crescent',
    initials: 'PM',
    color: '#7C3AED',
  },
] as const;

export const MARQUEE_LOGOS = [
  'Google',
  'Stripe',
  'Airbnb',
  'Atlassian',
  'Notion',
  'Linear',
  'Vercel',
  'Adobe',
] as const;
