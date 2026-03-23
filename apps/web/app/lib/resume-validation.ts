export function validateResumeFlow(resumeFile: File | null, jobDescription?: string) {
  if (!resumeFile) {
    return 'Please upload your resume';
  }

  if (!jobDescription?.trim()) {
    return 'Please paste the job description';
  }

  return null;
}
