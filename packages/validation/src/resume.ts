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

export const llmOutputSchema = z.object({
  is_valid: z.boolean(),
  job_title: z.string().min(1, 'Job title is required'),
  candidate_name: z.string().min(1, 'Candidate name is required'),
  overall_score: z.number().min(0).max(100),
  breakdown: z.object({
    skills_match: z.number().min(0).max(100),
    experience_relevance: z.number().min(0).max(100),
    education: z.number().min(0).max(100),
  }),
  matched_keywords: z.array(z.string()),
  missing_keywords: z.array(z.string()),
  suggestions: z.array(
    z.object({
      section: z.enum(['Summary', 'Experience', 'Skills', 'Projects', 'Education']),
      issue: z.string().min(1, 'Issue description is required'),
      fix: z.string().min(1, 'Fix description is required'),
    })
  ),
  summary: z.string().min(1, 'Summary is required'),
});

export type LLMOutput = z.infer<typeof llmOutputSchema>;
