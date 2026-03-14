'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UploadResumeCard, JDTextarea, AppButton, Spinner } from '@repo/ui';
import { uploadResume } from '../services/resume.service';
import { validateResumeFlow } from '../lib/resume-validation';
import { toast } from '@repo/ui';
import { useRouter } from 'next/navigation';
import type { FormValues } from '@repo/types';
import { RESUME_UPLOAD_STEPS } from '../constants/resume';

export default function ResumeUploadForm() {
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const router = useRouter();

  const { handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      resume: null,
      jobDescription: '',
    },
  });

  const resumeFile = watch('resume');
  const jobDescription = watch('jobDescription');

  const handleFileUpload = async (file: File) => {
    setValue('resume', file);
  };

  const onSubmit = async () => {
    const error = validateResumeFlow(resumeFile, jobDescription);

    if (error) {
      toast.error(error);
      return;
    }

    if (!resumeFile) return;

    try {
      setLoading(true);
      setStepIndex(0);

      const interval = setInterval(() => {
        setStepIndex((prev) => (prev < RESUME_UPLOAD_STEPS.length - 1 ? prev + 1 : prev));
      }, 1200);

      await uploadResume(resumeFile, jobDescription);

      clearInterval(interval);
      router.push('/results');
    } catch {
      toast.error('Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur">
          <Spinner className="h-10 w-10 text-primary" />
          <h2 className="mt-4 text-xl font-semibold">Analyzing Your Resume</h2>
          <p className="text-muted-foreground mt-2">{RESUME_UPLOAD_STEPS[stepIndex]}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <UploadResumeCard onUpload={handleFileUpload} />
          <JDTextarea
            value={jobDescription}
            onChange={(value) => setValue('jobDescription', value)}
          />
        </div>

        <div className="mt-10 flex justify-center">
          <AppButton type="submit" size="md" loading={loading}>
            Analyze Resume
          </AppButton>
        </div>
      </form>
    </>
  );
}
