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
