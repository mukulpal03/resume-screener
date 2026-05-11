import { analyzeResumeSchema, z } from '@repo/validation';

const clientSchema = z.object({
  resume: z.custom<File>((val) => val instanceof File, {
    message: 'Please upload your resume',
  }),
  jobDescription: analyzeResumeSchema.shape.jobDescription,
});

export function validateResumeFlow(resumeFile: File | null, jobDescription?: string) {
  const result = clientSchema.safeParse({
    resume: resumeFile,
    jobDescription: jobDescription?.trim() || undefined,
  });

  if (!result.success) {
    return result?.error?.issues[0]?.message;
  }

  return null;
}
