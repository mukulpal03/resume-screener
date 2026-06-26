import { z } from 'zod';

export const analyzeResumeSchema = z.object({
  jobDescription: z
    .string({
      error: (iss) => {
        if (iss.input === undefined) return 'Job description is required';
        return 'Job description must be a string';
      },
    })
    .min(50, 'Job description must be at least 50 characters long')
    .max(5000, 'Job description is too long (max 5000 characters)')
    .trim(),
});

export type AnalyzeResumeInput = z.infer<typeof analyzeResumeSchema>;

const normalizeSection = (val: unknown): string => {
  if (typeof val !== 'string') return 'Experience';
  const clean = val.trim().toLowerCase();

  if (clean.includes('summary')) return 'Summary';
  if (clean.includes('experience') || clean.includes('history') || clean.includes('work'))
    return 'Experience';
  if (
    clean.includes('skills') ||
    clean.includes('technologies') ||
    clean.includes('languages') ||
    clean.includes('tools')
  )
    return 'Skills';
  if (clean.includes('projects') || clean.includes('portfolio') || clean.includes('publications'))
    return 'Projects';
  if (
    clean.includes('education') ||
    clean.includes('certifications') ||
    clean.includes('academic') ||
    clean.includes('degrees')
  )
    return 'Education';

  return 'Experience';
};

const arrayPreprocess = (val: unknown) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') return [val];
  if (!val) return [];
  return val;
};

export const llmOutputSchema = z.object({
  job_title: z.string().min(1, 'Job title is required'),
  candidate_name: z.string().min(1, 'Candidate name is required'),
  overall_score: z.coerce.number().min(0).max(100),
  breakdown: z.object({
    skills_match: z.coerce.number().min(0).max(100),
    experience_relevance: z.coerce.number().min(0).max(100),
    education: z.coerce.number().min(0).max(100),
  }),
  matched_keywords: z.preprocess(arrayPreprocess, z.array(z.string())),
  missing_keywords: z.preprocess(arrayPreprocess, z.array(z.string())),
  suggestions: z.array(
    z.object({
      section: z.preprocess(
        normalizeSection,
        z.enum(['Summary', 'Experience', 'Skills', 'Projects', 'Education'])
      ),
      issue: z.string().min(1, 'Issue description is required'),
      fix: z.string().min(1, 'Fix description is required'),
    })
  ),
  summary: z.string().min(1, 'Summary is required'),
});

export type LLMOutput = z.infer<typeof llmOutputSchema>;
